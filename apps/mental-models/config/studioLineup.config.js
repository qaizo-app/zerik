// Реестр всех приложений студии Qaizo — для cross-promotion в SettingsScreen
// и (позже) для контекстных deep-link "связанная карточка в другом апе".

export const studioApps = [
  {
    slug: 'senik',
    is_flagship: true,
    category_slug: 'mental_models',
    store_id_android: 'com.qaizo.senik',
    store_id_ios: null,
    store_url: null,
    i18n: {
      ru: { name: 'Senik', tagline: 'Одна ментальная модель. Каждый день.' },
      en: { name: 'Senik', tagline: 'One mental model. Every day.' }
    }
  },
  {
    slug: 'biased',
    is_flagship: false,
    category_slug: 'cognitive_biases',
    store_id_android: 'com.qaizo.biased',
    store_id_ios: null,
    store_url: null,
    i18n: {
      ru: { name: 'Biased', tagline: 'Слепое пятно. Каждый день.' },
      en: { name: 'Biased', tagline: 'Your blind spot. Daily.' }
    }
  },
  {
    slug: 'cavil',
    is_flagship: false,
    category_slug: 'rhetorical_fallacies',
    store_id_android: 'com.qaizo.cavil',
    store_id_ios: null,
    store_url: null,
    i18n: {
      ru: { name: 'Cavil', tagline: 'Уловка в речи. Каждый день.' },
      en: { name: 'Cavil', tagline: 'The trick in their mouth. Daily.' }
    }
  },
  {
    slug: 'thought_experiments',
    is_flagship: false,
    category_slug: 'thought_experiments',
    store_id_android: null,
    store_id_ios: null,
    store_url: null,
    coming_soon: true,
    i18n: {
      ru: { name: 'Thought Experiments', tagline: 'Дилемма вагонетки и не только.' },
      en: { name: 'Thought Experiments', tagline: 'The trolley problem and beyond.' }
    }
  },
  {
    slug: 'psychology_experiments',
    is_flagship: false,
    category_slug: 'psychology_experiments',
    store_id_android: null,
    store_id_ios: null,
    store_url: null,
    coming_soon: true,
    i18n: {
      ru: { name: 'Psychology Experiments', tagline: 'Классика и современная критика.' },
      en: { name: 'Psychology Experiments', tagline: 'Classics and modern critique.' }
    }
  }
];
