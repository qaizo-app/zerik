// Публичные Firebase-параметры для Cavil. Отдельный Firebase-проект.
// projectId заполнить после создания проекта в Firebase Console.

export const firebase = {
  projectId: null,                  // TODO: заполнить из Firebase Console (например 'cavil-7f3a2')
  region:    'europe-west1',

  googleWebClientId: null,          // заполнить после включения Google Sign-In

  collections: {
    cards:        'fallacies',
    userProgress: 'user_progress',
    studioMeta:   'studio_meta'
  }
};
