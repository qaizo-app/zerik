// User-facing brand strings — все тексты, упоминающие имя продукта/студии, идут отсюда.
// Это даёт дешёвый rebrand: финальные имена выбираются перед релизом, меняем один файл.

export const brand = {
  studio: {
    name:    'Zerik Studio',  // working name
    tagline: {
      ru: 'Студия ежедневного редакторского контента',
      en: 'Daily editorial content studio'
    }
  },
  app: {
    name:    'Mental Models', // working name
    tagline: {
      ru: 'Одна модель в день — для ясного мышления',
      en: 'One model a day — for sharper thinking'
    }
  },
  primaryCategory: 'mental_models',
  bundleId: 'com.zerikstudio.mentalmodels',
  legal: {
    // Заполнить перед public-релизом (GitHub Pages / Notion / standalone сайт).
    // null прячет ссылки из SettingsScreen.
    privacyUrl: null,
    termsUrl:   null,
    supportEmail: null
  }
};
