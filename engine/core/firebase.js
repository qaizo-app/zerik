// Адаптер вокруг Firebase JS SDK для движка. Использует @react-native-firebase
// (нативный SDK) в проде/dev-билде, и graceful fallback к null если модуль
// не доступен (Expo Go) — тогда сервисы движка переходят в offline/seed-режим.
//
// Приложение НЕ инициализирует Firebase явно — @react-native-firebase делает это
// автоматически из google-services.json / GoogleService-Info.plist.

let _firestore = null;
let _auth = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _firestore = require('@react-native-firebase/firestore').default;
} catch (e) {
  // Firebase не доступен (Expo Go или модуль не установлен) — движок будет
  // работать на локальном seed.
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _auth = require('@react-native-firebase/auth').default;
} catch (e) {}

export function hasFirebase() {
  return !!_firestore;
}

export function getFirestore() {
  if (!_firestore) {
    throw new Error('[engine/firebase] Firestore module not available. Are you running in Expo Go?');
  }
  return _firestore();
}

export function getAuth() {
  if (!_auth) {
    throw new Error('[engine/firebase] Auth module not available. Are you running in Expo Go?');
  }
  return _auth;
}

export function tryFirestore() {
  return _firestore ? _firestore() : null;
}

export function tryAuth() {
  return _auth || null;
}
