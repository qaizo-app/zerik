// Публичные Firebase-параметры для Biased. Отдельный Firebase-проект от Senik.
// Секреты идут в .env.local и НЕ коммитятся.

export const firebase = {
  projectId: 'biased-94cc9',
  region:    'europe-west1',

  googleWebClientId: null,        // заполнить после включения Google Sign-In в Firebase Console

  collections: {
    cards:        'biases',
    userProgress: 'user_progress',
    studioMeta:   'studio_meta'
  }
};
