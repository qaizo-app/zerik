// Публичные Firebase-параметры для Senik. Не секреты — встроены в
// google-services.json и GoogleService-Info.plist, безопасно коммитить.
//
// Секреты (Service Account JSON для seed-скриптов, RevenueCat secret keys)
// идут в .env.local и НЕ коммитятся.

export const firebase = {
  projectId: 'mental-models-mvp',
  region:    'europe-west1',

  // Web Client ID для Google Sign-In в RN.
  // Берётся из Firebase Console → Authentication → Sign-in method → Google →
  // раздел "Web SDK configuration" → "Web client ID".
  googleWebClientId: '116778984611-4essoktqdriqfshup3m2bf8o7ire3qrr.apps.googleusercontent.com',

  // Имена коллекций Firestore — конфиг ContentService движка.
  collections: {
    cards:        'models',
    scenarioStats:'scenario_stats',
    userProgress: 'user_progress',
    studioMeta:   'studio_meta'
  }
};
