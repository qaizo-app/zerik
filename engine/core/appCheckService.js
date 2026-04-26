// AppCheckService — инициализация Firebase App Check.
// Dev: debug provider (выводит debug-token в logcat — нужно зарегистрировать
// в Firebase Console → App Check → Apps → "Manage debug tokens").
// Production: Play Integrity (Android) — встроено в Play Store, без доп.настройки.
//
// Активируется один раз при старте app. Если нативный модуль не подключён
// (Expo Go, web preview) — silent no-op.

let _appCheck = null;
try {
  _appCheck = require('@react-native-firebase/app-check').default;
} catch (e) {
  _appCheck = null;
}

let _activated = false;

export const appCheckService = {

  /**
   * Активирует App Check.
   * @param {Object} opts
   * @param {boolean} opts.isDevelopment Использовать debug provider (по умолчанию __DEV__).
   * @returns {Promise<boolean>} true если активирован, false если модуль не доступен.
   */
  async activate({ isDevelopment } = {}) {
    if (_activated) return true;
    if (!_appCheck) return false;

    const dev = typeof isDevelopment === 'boolean' ? isDevelopment : (typeof __DEV__ !== 'undefined' && __DEV__);

    try {
      const provider = _appCheck().newReactNativeFirebaseAppCheckProvider();
      provider.configure({
        android: {
          provider: dev ? 'debug' : 'playIntegrity',
          debugToken: undefined  // если нужно жёсткий debug token — задать строкой
        },
        apple: {
          provider: dev ? 'debug' : 'appAttestWithDeviceCheckFallback',
          debugToken: undefined
        },
        web: {
          provider: 'reCaptchaV3',
          siteKey: 'unused'  // web пока не нужен
        }
      });
      await _appCheck().initializeAppCheck({ provider, isTokenAutoRefreshEnabled: true });
      _activated = true;
      return true;
    } catch (e) {
      return false;
    }
  },

  isActivated() { return _activated; },

  async getToken() {
    if (!_appCheck || !_activated) return null;
    try {
      const { token } = await _appCheck().getToken(false);
      return token;
    } catch (e) {
      return null;
    }
  }
};

export default appCheckService;
