// AuthService — обёртка над Firebase Auth (native SDK через @react-native-firebase).
// Порт из Qaizo с двумя расширениями:
//   1. Apple Sign-In (Qaizo не делал — для Senik обязателен по правилам Apple)
//   2. webClientId конфигурируется приложением (не хардкод как в Qaizo)
//
// Email/Password + Google + Apple. Соц-провайдеры graceful fallback если нативные
// модули не установлены (Expo Go).

import { tryAuth } from './firebase';

let _GoogleSignin = null;
let _appleAuth = null;

try {
  _GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (e) {}

try {
  _appleAuth = require('@invertase/react-native-apple-authentication').appleAuth;
} catch (e) {}

export class AuthService {
  /**
   * @param {object} config
   * @param {string} config.googleWebClientId Web client ID из Firebase Console
   * @param {function} [config.onAnalyticsEvent] (name, payload) для аналитики
   */
  constructor(config) {
    this.googleWebClientId = config.googleWebClientId;
    this.onAnalyticsEvent = config.onAnalyticsEvent || (() => {});

    if (_GoogleSignin && this.googleWebClientId) {
      try {
        _GoogleSignin.configure({ webClientId: this.googleWebClientId });
      } catch (e) {
        if (__DEV__) console.warn('[AuthService] GoogleSignin.configure failed:', e?.message);
      }
    }
  }

  // ─── state ──────────────────────────────────────────────────────────────

  getCurrentUser() {
    const auth = tryAuth();
    return auth ? auth().currentUser : null;
  }

  getUid() {
    return this.getCurrentUser()?.uid || null;
  }

  isEmailVerified() {
    return !!this.getCurrentUser()?.emailVerified;
  }

  onAuthChanged(callback) {
    const auth = tryAuth();
    if (!auth) return () => {};
    return auth().onAuthStateChanged(callback);
  }

  // ─── email/password ─────────────────────────────────────────────────────

  async register(email, password, displayName) {
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };
    try {
      const cred = await auth().createUserWithEmailAndPassword(email, password);
      if (displayName) {
        try { await cred.user.updateProfile({ displayName }); } catch (e) {}
      }
      try { await cred.user.sendEmailVerification(); } catch (e) {}
      this.onAnalyticsEvent('user_registered', { method: 'email' });
      return { success: true, user: cred.user };
    } catch (e) {
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  async login(email, password) {
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };
    try {
      const cred = await auth().signInWithEmailAndPassword(email, password);
      this.onAnalyticsEvent('user_logged_in', { method: 'email' });
      return { success: true, user: cred.user };
    } catch (e) {
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  async resetPassword(email) {
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };
    try {
      await auth().sendPasswordResetEmail(email);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  // ─── Google ─────────────────────────────────────────────────────────────

  async loginWithGoogle() {
    if (!_GoogleSignin) {
      return { success: false, error: 'google_unavailable', message: 'Google Sign-In not available (Expo Go?)' };
    }
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };

    try {
      await _GoogleSignin.hasPlayServices();
      const response = await _GoogleSignin.signIn();
      const idToken = response.data?.idToken || response.idToken;
      if (!idToken) return { success: false, error: 'no_id_token' };

      const credential = auth.GoogleAuthProvider.credential(idToken);
      const cred = await auth().signInWithCredential(credential);
      const isNew = !!cred.additionalUserInfo?.isNewUser;
      this.onAnalyticsEvent(isNew ? 'user_registered' : 'user_logged_in', { method: 'google' });
      return { success: true, user: cred.user, isNew };
    } catch (e) {
      if (e.code === 'SIGN_IN_CANCELLED') return { success: false, error: 'cancelled' };
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  // ─── Apple ──────────────────────────────────────────────────────────────

  async loginWithApple() {
    if (!_appleAuth) {
      return { success: false, error: 'apple_unavailable', message: 'Apple Sign-In not available (Android or Expo Go)' };
    }
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };

    try {
      const appleResponse = await _appleAuth.performRequest({
        requestedOperation: _appleAuth.Operation.LOGIN,
        requestedScopes: [_appleAuth.Scope.EMAIL, _appleAuth.Scope.FULL_NAME]
      });
      const { identityToken, nonce } = appleResponse;
      if (!identityToken) return { success: false, error: 'no_identity_token' };

      const credential = auth.AppleAuthProvider.credential(identityToken, nonce);
      const cred = await auth().signInWithCredential(credential);
      const isNew = !!cred.additionalUserInfo?.isNewUser;
      this.onAnalyticsEvent(isNew ? 'user_registered' : 'user_logged_in', { method: 'apple' });
      return { success: true, user: cred.user, isNew };
    } catch (e) {
      if (e.code === '1001') return { success: false, error: 'cancelled' };
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  // ─── logout / delete ────────────────────────────────────────────────────

  async logout() {
    const auth = tryAuth();
    if (!auth) return { success: false, error: 'auth_unavailable' };
    try {
      try { if (_GoogleSignin) await _GoogleSignin.signOut(); } catch (e) {}
      await auth().signOut();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  async deleteAccount() {
    const user = this.getCurrentUser();
    if (!user) return { success: false, error: 'no_user' };
    try {
      await user.delete();
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.code === 'auth/requires-recent-login' ? 'reauth_required' : (e.code || 'unknown'),
        message: e.message
      };
    }
  }
}

export default AuthService;
