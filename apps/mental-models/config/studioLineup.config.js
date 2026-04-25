// Реестр всех приложений студии — для cross-promotion в SettingsScreen
// и (позже) для контекстных deep-link "связанная карточка в Mental Models".
// Пока заполнено только для Mental Models — остальные slug-ы будут включаться
// по мере релиза каждого приложения линейки.

export const studioApps = [
  {
    slug: 'mental_models',
    is_flagship: true,
    category_slug: 'mental_models',
    store_id_android: 'com.zerik.mentalmodels',
    store_id_ios: null,
    store_url: null,
    i18n: {
      ru: { name: 'Mental Models', tagline: 'Одна модель в день — для ясного мышления' },
      en: { name: 'Mental Models', tagline: 'One model a day — for sharper thinking' }
    }
  },
  {
    slug: 'cognitive_biases',
    is_flagship: false,
    category_slug: 'cognitive_biases',
    store_id_android: null,
    store_id_ios: null,
    store_url: null,
    coming_soon: true,
    i18n: {
      ru: { name: 'Cognitive Biases Daily', tagline: 'Скоро · Одно искажение в день' },
      en: { name: 'Cognitive Biases Daily', tagline: 'Coming soon · One bias a day' }
    }
  },
  {
    slug: 'thought_experiments',
    is_flagship: false,
    category_slug: 'thought_experiments',
    coming_soon: true,
    i18n: {
      ru: { name: 'Thought Experiments', tagline: 'Скоро · Дилемма вагонетки и не только' },
      en: { name: 'Thought Experiments', tagline: 'Coming soon · The trolley problem and beyond' }
    }
  }
];
