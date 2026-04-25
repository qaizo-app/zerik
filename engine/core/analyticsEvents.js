// AnalyticsEvents — обёртка над Firebase Analytics с уважением consent.
// Порт из Qaizo. В Expo Go modul недоступен — события молча игнорируются.

import consentService from './consentService';

let _analytics = null;

try {
  _analytics = require('@react-native-firebase/analytics').default;
} catch (e) {}

export const analyticsEvents = {

  async syncNativeConsent() {
    if (!_analytics) return;
    try {
      await _analytics().setAnalyticsCollectionEnabled(consentService.getAnalyticsConsent());
    } catch (e) {
      if (__DEV__) console.warn('[analyticsEvents.syncNativeConsent] failed:', e?.message);
    }
  },

  logEvent(name, params = {}) {
    if (!_analytics) return;
    if (!consentService.getAnalyticsConsent()) return;
    try {
      _analytics().logEvent(name, params);
    } catch (e) {
      if (__DEV__) console.warn(`[analyticsEvents.logEvent ${name}]:`, e?.message);
    }
  },

  setUserProperty(key, value) {
    if (!_analytics) return;
    if (!consentService.getAnalyticsConsent()) return;
    try {
      _analytics().setUserProperty(key, value == null ? null : String(value));
    } catch (e) {}
  },

  setUserId(uid) {
    if (!_analytics) return;
    if (!consentService.getAnalyticsConsent()) return;
    try {
      _analytics().setUserId(uid || null);
    } catch (e) {}
  }
};

export default analyticsEvents;
