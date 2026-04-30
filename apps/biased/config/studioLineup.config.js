export const studioApps = [
  {
    slug: 'biased',
    is_flagship: true,
    category_slug: 'cognitive_biases',
    store_id_android: 'com.qaizo.biased',
    store_id_ios: null,
    store_url: null,
    i18n: {
      ru: { name: 'Biased', tagline: 'Одно когнитивное искажение. Каждый день.' },
      en: { name: 'Biased', tagline: 'One cognitive bias. Every day.' }
    }
  },
  {
    slug: 'senik',
    is_flagship: false,
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
