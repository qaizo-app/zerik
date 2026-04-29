// ProgressService — прогресс пользователя: streak, открытые карточки,
// сохранённые, scenario_answers. Гибрид Firestore (если залогинен) +
// AsyncStorage (гость).
//
// Документ: user_progress/{uid} = {
//   streak_current, streak_best, last_opened_date,
//   total_cards_read, saved_card_ids[], scenario_answers{},
//   language_preference, subscription{}
// }

import { tryFirestore, tryAuth } from './firebase';
import { getItem, setItem } from './storage';

const GUEST_KEY = 'zerik:progress:guest';

const DEFAULT_PROGRESS = {
  streak_current: 0,
  streak_best: 0,
  last_opened_date: null,
  total_cards_read: 0,
  saved_card_ids: [],
  opened_card_ids: [],
  scenario_answers: {},
  language_preference: 'ru',
  subscription: { active: false, plan: null, renews_at: null }
};

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function prevDayIso(iso) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export class ProgressService {
  /**
   * @param {object} config
   * @param {string} config.userProgressCollection Например 'user_progress'
   */
  constructor(config) {
    this.userProgressCollection = config.userProgressCollection;
  }

  _getUid() {
    const auth = tryAuth();
    return auth ? (auth().currentUser?.uid || null) : null;
  }

  _doc() {
    const fs = tryFirestore();
    const uid = this._getUid();
    if (!fs || !uid) return null;
    return fs.collection(this.userProgressCollection).doc(uid);
  }

  // ─── read/write base ────────────────────────────────────────────────────

  async _read() {
    const doc = this._doc();
    if (doc) {
      try {
        const snap = await doc.get();
        if (snap.exists) return { ...DEFAULT_PROGRESS, ...snap.data() };
      } catch (e) {
        if (__DEV__) console.warn('[ProgressService._read] firestore failed:', e?.message);
      }
    }
    return await getItem(GUEST_KEY, { ...DEFAULT_PROGRESS });
  }

  async _write(patch) {
    const doc = this._doc();
    const merged = { ...(await this._read()), ...patch };

    if (doc) {
      try {
        await doc.set(merged, { merge: true });
        return merged;
      } catch (e) {
        if (__DEV__) console.warn('[ProgressService._write] firestore failed:', e?.message);
      }
    }
    await setItem(GUEST_KEY, merged);
    return merged;
  }

  // ─── public API ─────────────────────────────────────────────────────────

  async getProgress() {
    return await this._read();
  }

  /**
   * Зафиксировать что пользователь открыл карточку. Обновляет streak,
   * total_cards_read и opened_card_ids[]. Можно вызывать при каждом открытии —
   * streak инкрементируется максимум раз в день, история не дублируется.
   */
  async recordCardOpened(cardId) {
    const prog = await this._read();
    const today = todayIso();
    const openedIds = prog.opened_card_ids || [];
    const alreadyInHistory = cardId ? openedIds.includes(cardId) : false;

    if (prog.last_opened_date === today && alreadyInHistory) {
      return prog; // ничего нового
    }

    const patch = {};

    // Streak обновляется только при первом открытии за день
    if (prog.last_opened_date !== today) {
      let newStreak;
      if (prog.last_opened_date === prevDayIso(today)) {
        newStreak = (prog.streak_current || 0) + 1;
      } else {
        newStreak = 1; // streak оборвался
      }
      patch.streak_current = newStreak;
      patch.streak_best = Math.max(newStreak, prog.streak_best || 0);
      patch.last_opened_date = today;
      patch.total_cards_read = (prog.total_cards_read || 0) + 1;
    }

    if (cardId && !alreadyInHistory) {
      patch.opened_card_ids = [...openedIds, cardId];
    }

    if (Object.keys(patch).length === 0) return prog;
    return await this._write(patch);
  }

  async recordScenarioAnswer(cardId, optionId) {
    if (!cardId || !optionId) return null;
    const prog = await this._read();
    if (prog.scenario_answers?.[cardId]) return prog; // одноразово
    return await this._write({
      scenario_answers: { ...(prog.scenario_answers || {}), [cardId]: optionId }
    });
  }

  async toggleSaved(cardId) {
    if (!cardId) return null;
    const prog = await this._read();
    const list = prog.saved_card_ids || [];
    const next = list.includes(cardId) ? list.filter(id => id !== cardId) : [...list, cardId];
    return await this._write({ saved_card_ids: next });
  }

  async getSavedIds() {
    const prog = await this._read();
    return prog.saved_card_ids || [];
  }

  async getStreak() {
    const prog = await this._read();
    const today = todayIso();
    const at_risk = prog.last_opened_date && prog.last_opened_date !== today &&
                    prog.last_opened_date === prevDayIso(today);
    return {
      current: prog.streak_current || 0,
      best:    prog.streak_best || 0,
      at_risk
    };
  }

  async getScenarioAnswer(cardId) {
    const prog = await this._read();
    return prog.scenario_answers?.[cardId] || null;
  }

  async setLanguagePreference(lang) {
    return await this._write({ language_preference: lang });
  }

  async setSubscription(sub) {
    return await this._write({ subscription: sub });
  }

  async getOpenedIds() {
    const prog = await this._read();
    return prog.opened_card_ids || [];
  }

  /**
   * При логине — переносим guest-прогресс из AsyncStorage в Firestore-документ.
   * Вызывать сразу после успешного auth.
   */
  async migrateGuestToCloud() {
    const fs = tryFirestore();
    const uid = this._getUid();
    if (!fs || !uid) return false;

    const guest = await getItem(GUEST_KEY, null);
    if (!guest) return false;

    try {
      const doc = fs.collection(this.userProgressCollection).doc(uid);
      const snap = await doc.get();
      if (snap.exists) {
        const cloud = snap.data();
        // Конфликт-резолюшн: max() для счётчиков, union для массивов.
        await doc.set({
          streak_current: Math.max(guest.streak_current || 0, cloud.streak_current || 0),
          streak_best: Math.max(guest.streak_best || 0, cloud.streak_best || 0),
          total_cards_read: Math.max(guest.total_cards_read || 0, cloud.total_cards_read || 0),
          saved_card_ids: Array.from(new Set([...(guest.saved_card_ids || []), ...(cloud.saved_card_ids || [])])),
          opened_card_ids: Array.from(new Set([...(guest.opened_card_ids || []), ...(cloud.opened_card_ids || [])])),
          scenario_answers: { ...(cloud.scenario_answers || {}), ...(guest.scenario_answers || {}) },
          last_opened_date: [guest.last_opened_date, cloud.last_opened_date].filter(Boolean).sort().pop() || null
        }, { merge: true });
      } else {
        await doc.set(guest, { merge: true });
      }
      return true;
    } catch (e) {
      if (__DEV__) console.warn('[ProgressService.migrateGuestToCloud] failed:', e?.message);
      return false;
    }
  }
}

export default ProgressService;
