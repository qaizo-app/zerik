// Pluralization helper. Russian has three forms; English has two.
//
// Russian rules (для день — день/дня/дней):
//   - 1, 21, 31, ... (ending in 1 but NOT 11) → form 0 (день)
//   - 2-4, 22-24, ... (ending 2-4 but NOT 12-14) → form 1 (дня)
//   - everything else (5-20, 25-30, ...) → form 2 (дней)
//
// Usage:
//   pluralize(n, 'ru', { ru: ['день', 'дня', 'дней'], en: ['day', 'days'] })
//
// Or use shortcuts: pluralizeDays(n, locale).

export function pluralize(n, locale, forms) {
  const f = forms[locale] || forms.en || [''];
  const abs = Math.abs(n);

  if (locale === 'ru' && f.length === 3) {
    const lastTwo = abs % 100;
    const last    = abs % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return f[2];
    if (last === 1)                     return f[0];
    if (last >= 2 && last <= 4)         return f[1];
    return f[2];
  }

  // EN-style: singular + plural
  return n === 1 ? f[0] : (f[1] || f[0]);
}

export function pluralizeDays(n, locale) {
  return pluralize(n, locale, {
    ru: ['день', 'дня', 'дней'],
    en: ['day',  'days']
  });
}

// Uppercase variants for caps-locked UI labels (DAYS, ДНЕЙ, etc.)
export function pluralizeDaysUpper(n, locale) {
  return pluralizeDays(n, locale).toUpperCase();
}
