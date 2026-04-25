// VotingService — голосования по сценариям карточки.
//
// Два режима:
//   1. hardcoded_stats — академические данные с первого дня релиза. Голос
//      пользователя сохраняется в user_progress.scenario_answers, но НЕ влияет
//      на отображаемые проценты. Используется в Thought Experiments / Psych
//      Experiments (Moral Machine 40M, Ultimatum Game и т.д.).
//   2. distributed counters — обычный режим. NUM_SHARDS шардов на карточку,
//      пишем в случайный, читаем агрегацией. Обходит Firestore single-doc
//      ~1 write/sec лимит.
//
// UX-правило: пока агрегированный total < min_votes_to_show — UI показывает
// "Ты N-й, кто ответил" вместо процентов.

import { tryFirestore } from './firebase';
import { getItem, setItem, getCached, setCached } from './storage';

const NUM_SHARDS = 10;
const STATS_TTL_MS = 60 * 60 * 1000;  // 1 час
const STATS_CACHE_KEY = (col, id) => `zerik:voting:${col}:${id}`;
const VOTED_KEY = (col, id) => `zerik:voting:${col}:${id}:voted`;
const DEFAULT_MIN_VOTES_TO_SHOW = 1000;

export class VotingService {
  /**
   * @param {object} config
   * @param {string} config.statsCollectionName Например 'scenario_stats'
   * @param {number} config.minVotesToShow      Опц. порог для показа процентов
   */
  constructor(config) {
    this.statsCollectionName = config.statsCollectionName;
    this.minVotesToShow = config.minVotesToShow || DEFAULT_MIN_VOTES_TO_SHOW;
  }

  _statsDoc(modelId) {
    const fs = tryFirestore();
    return fs ? fs.collection(this.statsCollectionName).doc(modelId) : null;
  }

  // ─── public API ─────────────────────────────────────────────────────────

  /**
   * Сохранить голос. Если у карточки есть hardcoded_stats — голос
   * фиксируется только локально (для UX "ты N-й кто ответил" и для
   * scenario_answers в user progress), не пишется в Firestore.
   */
  async vote(modelId, optionId, hardcodedStats = null) {
    if (!modelId || !optionId) return false;

    // Защита от двойного голоса (UI должен и так блокировать, но дублируем).
    const already = await getItem(VOTED_KEY(this.statsCollectionName, modelId), null);
    if (already) return false;
    await setItem(VOTED_KEY(this.statsCollectionName, modelId), { optionId, ts: Date.now() });

    if (hardcodedStats) {
      // Для академических карточек не пишем в Firestore — статистика фиксированная.
      return true;
    }

    const doc = this._statsDoc(modelId);
    if (!doc) {
      // Offline — голос всё равно сохранён локально, синк позже.
      return true;
    }

    try {
      const fs = tryFirestore();
      const FieldValue = fs.constructor?.FieldValue || (fs.FieldValue);
      const shardId = Math.floor(Math.random() * NUM_SHARDS);
      const shardRef = doc.collection('shards').doc(`shard_${shardId}`);
      await shardRef.set({
        total: FieldValue.increment(1),
        options: { [optionId]: { count: FieldValue.increment(1) } }
      }, { merge: true });

      // Опционально обновляем metadata.total_votes в корневом документе.
      // (Точную агрегацию делает Cloud Function позже — в MVP считаем при
      // каждом getStats.)
      return true;
    } catch (e) {
      if (__DEV__) console.warn('[VotingService.vote] failed:', e?.message);
      return false;
    }
  }

  /**
   * Получить агрегированную статистику. Возвращает:
   *   {
   *     total: number,
   *     options: { [optionId]: { count, percentage } },
   *     show_percentages: boolean,   // true если total >= minVotesToShow или is_academic
   *     is_academic: boolean,
   *     source: string?
   *   }
   */
  async getStats(modelId, hardcodedStats = null) {
    if (hardcodedStats) {
      const total = hardcodedStats.total_votes || 0;
      const options = {};
      for (const [k, v] of Object.entries(hardcodedStats.options || {})) {
        const count = v.count || 0;
        options[k] = { count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 };
      }
      return {
        total,
        options,
        show_percentages: true,
        is_academic: true,
        source: hardcodedStats.source || null,
        sample_year: hardcodedStats.year || null
      };
    }

    // Кэш — для популярных карточек снижает нагрузку и стоимость reads.
    const cached = await getCached(STATS_CACHE_KEY(this.statsCollectionName, modelId), STATS_TTL_MS);
    if (cached) return cached;

    const doc = this._statsDoc(modelId);
    if (!doc) {
      return { total: 0, options: {}, show_percentages: false, is_academic: false };
    }

    try {
      const shardsSnap = await doc.collection('shards').get();
      let total = 0;
      const options = {};
      shardsSnap.forEach(d => {
        const data = d.data();
        total += data.total || 0;
        for (const [opt, val] of Object.entries(data.options || {})) {
          options[opt] = options[opt] || { count: 0 };
          options[opt].count += val.count || 0;
        }
      });

      for (const opt of Object.keys(options)) {
        options[opt].percentage = total > 0 ? Math.round((options[opt].count / total) * 100) : 0;
      }

      const result = {
        total,
        options,
        show_percentages: total >= this.minVotesToShow,
        is_academic: false,
        source: null
      };
      await setCached(STATS_CACHE_KEY(this.statsCollectionName, modelId), result);
      return result;
    } catch (e) {
      if (__DEV__) console.warn('[VotingService.getStats] failed:', e?.message);
      return { total: 0, options: {}, show_percentages: false, is_academic: false };
    }
  }

  async hasVoted(modelId) {
    const v = await getItem(VOTED_KEY(this.statsCollectionName, modelId), null);
    return v ? v.optionId : null;
  }
}

export default VotingService;
