// ContentService — абстракция над источником карточек.
//
// Три режима fallback (от лучшего к худшему):
//   1. Firestore (есть сеть + Firebase) — свежие данные, кэшируются в AsyncStorage
//   2. AsyncStorage (offline) — последний fetch
//   3. Bundled seed — если AsyncStorage пуст (первый запуск без сети)
//
// Приложение даёт конфиг (имена коллекций) + опционально bundled-seed массив.
// Это позволяет одному движку обслуживать разные продукты линейки без правки кода.

import { tryFirestore } from './firebase';
import { getItem, setItem } from './storage';

const CACHE_PREFIX = 'zerik:content:';
const RECENT_CACHE_KEY = (collection) => `${CACHE_PREFIX}${collection}:recent`;
const CARD_CACHE_KEY = (collection, id) => `${CACHE_PREFIX}${collection}:card:${id}`;
const RECENT_LIMIT = 30;

export class ContentService {
  /**
   * @param {object} config
   * @param {string} config.collectionName     Например 'models'
   * @param {string} config.statsCollectionName Например 'scenario_stats'
   * @param {string} config.userProgressCollection Например 'user_progress'
   * @param {Array}  config.bundledSeed        Опц. массив карточек для offline-fallback (первый запуск)
   */
  constructor(config) {
    this.collectionName = config.collectionName;
    this.statsCollectionName = config.statsCollectionName;
    this.userProgressCollection = config.userProgressCollection;
    this.bundledSeed = Array.isArray(config.bundledSeed) ? config.bundledSeed : [];
  }

  // ─── private helpers ────────────────────────────────────────────────────

  _col() {
    const fs = tryFirestore();
    return fs ? fs.collection(this.collectionName) : null;
  }

  _todayIso() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  _findInSeed(predicate) {
    return this.bundledSeed.find(predicate) || null;
  }

  // ─── public API ─────────────────────────────────────────────────────────

  /**
   * Карточка для сегодняшней даты (release_date <= today, последняя по дате).
   * Если ничего нет — возвращает первую из bundled seed.
   */
  async getCardForToday() {
    const today = this._todayIso();
    const col = this._col();

    if (col) {
      try {
        const snap = await col
          .where('release_date', '<=', today)
          .orderBy('release_date', 'desc')
          .limit(1)
          .get();
        if (!snap.empty) {
          const card = snap.docs[0].data();
          await setItem(CARD_CACHE_KEY(this.collectionName, card.id), card);
          return card;
        }
      } catch (e) {
        if (__DEV__) console.warn('[ContentService.getCardForToday] firestore failed:', e?.message);
      }
    }

    // Fallback: последняя карточка из recent-кэша
    const recent = await getItem(RECENT_CACHE_KEY(this.collectionName), null);
    if (Array.isArray(recent) && recent.length > 0) {
      const sorted = recent.slice().sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      const found = sorted.find(c => c.release_date <= today);
      if (found) return found;
    }

    // Fallback: bundled seed
    if (this.bundledSeed.length > 0) {
      const sorted = this.bundledSeed.slice().sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      return sorted.find(c => c.release_date <= today) || sorted[0];
    }

    return null;
  }

  async getCardById(id) {
    if (!id) return null;
    const col = this._col();

    if (col) {
      try {
        const snap = await col.doc(id).get();
        if (snap.exists) {
          const card = snap.data();
          await setItem(CARD_CACHE_KEY(this.collectionName, id), card);
          return card;
        }
      } catch (e) {
        if (__DEV__) console.warn(`[ContentService.getCardById] firestore failed for ${id}:`, e?.message);
      }
    }

    const cached = await getItem(CARD_CACHE_KEY(this.collectionName, id), null);
    if (cached) return cached;

    return this._findInSeed(c => c.id === id);
  }

  /**
   * Цепочка карточек, новейшие первыми. Поддерживает пагинацию через `before`
   * (release_date курсор).
   */
  async getCardChain({ limit = 20, before = null } = {}) {
    const col = this._col();
    const today = this._todayIso();

    // Deep-карточки (level 2+) не попадают в основной feed — они достижимы
    // только через onContinueDeeper кнопку из родительской level 1 карточки.
    const isRoot = (c) => c && c.id && !c.id.endsWith('_deep') && !c.parent_id;

    if (col) {
      try {
        // Берём с запасом, фильтруем deep-карточки клиентом (Firestore where !endsWith
        // не поддерживает; запрашиваем limit*2 чтобы после фильтра набрать limit).
        let query = col
          .where('release_date', '<=', before || today)
          .orderBy('release_date', 'desc')
          .limit(limit * 2);
        const snap = await query.get();
        const cards = snap.docs.map(d => d.data()).filter(isRoot).slice(0, limit);

        if (!before) {
          await setItem(RECENT_CACHE_KEY(this.collectionName), cards.slice(0, RECENT_LIMIT));
        }
        return cards;
      } catch (e) {
        if (__DEV__) console.warn('[ContentService.getCardChain] firestore failed:', e?.message);
      }
    }

    // Offline fallback
    const recent = await getItem(RECENT_CACHE_KEY(this.collectionName), null);
    const source = (Array.isArray(recent) && recent.length > 0) ? recent : this.bundledSeed;
    const sorted = source.slice().filter(isRoot).sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    const filtered = before ? sorted.filter(c => c.release_date < before) : sorted.filter(c => c.release_date <= today);
    return filtered.slice(0, limit);
  }

  /**
   * Уровни глубины конкретной карточки. Возвращает массив { level, card }.
   */
  async getCardLevels(cardId) {
    const root = await this.getCardById(cardId);
    if (!root || !Array.isArray(root.levels)) return [{ level: 1, card: root }];

    const out = [{ level: 1, card: root }];
    for (const lvl of root.levels) {
      if (lvl.level === 1) continue;
      const id = lvl.doc_ref?.split('/').pop();
      if (!id) continue;
      const card = await this.getCardById(id);
      if (card) out.push({ level: lvl.level, card });
    }
    return out;
  }

  /**
   * Простой клиентский поиск (без Firestore полнотекста). Для глобального поиска
   * нужен Algolia/Typesense — это позже, после 100+ карточек.
   */
  async searchCards({ query = '', tags = null, category = null, limit = 20 } = {}) {
    const all = await this.getCardChain({ limit: 200 });
    const q = (query || '').trim().toLowerCase();
    const filtered = all.filter(card => {
      if (category && card.category !== category) return false;
      if (Array.isArray(tags) && tags.length) {
        if (!tags.some(t => (card.tags || []).includes(t))) return false;
      }
      if (q.length > 0) {
        const haystack = [
          card.id,
          ...(Object.values(card.i18n || {}).flatMap(loc =>
            (loc.blocks || []).map(b => JSON.stringify(b.props || {}))
          ))
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    return filtered.slice(0, limit);
  }

  /**
   * Тёплая загрузка ленты в кэш. Вызывать после успешного логина или при
   * pull-to-refresh.
   */
  async warmCache(limit = RECENT_LIMIT) {
    const cards = await this.getCardChain({ limit });
    return cards.length;
  }
}

export default ContentService;
