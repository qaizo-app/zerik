// ConsentService — управление пользовательским согласием на трекинг.
// Три отдельных consent-флага: analytics, crash_reports, reminders.
// Порт из Qaizo, упрощён.

import { getItem, setItem } from './storage';

const KEY = 'zerik:consent:v1';

const DEFAULTS = {
  analytics:     true,   // Firebase Analytics
  crash_reports: true,   // Sentry
  reminders:     false,  // Push notifications — opt-in (требование Android 13+)
  loaded_at:     null
};

let _state = { ...DEFAULTS };
let _loaded = false;

export const consentService = {

  async load() {
    const stored = await getItem(KEY, null);
    if (stored) _state = { ...DEFAULTS, ...stored };
    _loaded = true;
    return _state;
  },

  isLoaded() { return _loaded; },

  getAll() { return { ..._state }; },

  getAnalyticsConsent()    { return !!_state.analytics; },
  getCrashReportsConsent() { return !!_state.crash_reports; },
  getReminderConsent()     { return !!_state.reminders; },

  async setAnalyticsConsent(value) {
    _state = { ..._state, analytics: !!value };
    await setItem(KEY, { ..._state, loaded_at: Date.now() });
  },

  async setCrashReportsConsent(value) {
    _state = { ..._state, crash_reports: !!value };
    await setItem(KEY, { ..._state, loaded_at: Date.now() });
  },

  async setReminderConsent(value) {
    _state = { ..._state, reminders: !!value };
    await setItem(KEY, { ..._state, loaded_at: Date.now() });
  }
};

export default consentService;
