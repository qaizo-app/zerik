// Публичные Firebase-параметры для Biased. Отдельный Firebase-проект от Senik.
// Секреты идут в .env.local и НЕ коммитятся.

export const firebase = {
  projectId: 'biased-94cc9',
  region:    'europe-west1',

  googleWebClientId: '445149034446-sir8l9ncl037l2soc9kek96a09mnr1ue.apps.googleusercontent.com',

  collections: {
    cards:        'biases',
    userProgress: 'user_progress',
    studioMeta:   'studio_meta'
  }
};
