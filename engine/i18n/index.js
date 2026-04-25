// Минималистичный i18n движка. Поддерживает {{var}}-подстановки.
// Приложение мерджит свои строки сверху через extendStrings().
//
// Не используем react-i18next/intl чтобы не тащить лишний bundle. Когда понадобится
// плюрализация и сложные форматы — мигрируем на одно из них без боли.

const _strings = { ru: {}, en: {} };
let _lang = 'ru';
const _listeners = new Set();

export function setLanguage(lang) {
  if (lang !== 'ru' && lang !== 'en') return;
  _lang = lang;
  _listeners.forEach(fn => { try { fn(lang); } catch (e) {} });
}

export function getLanguage() { return _lang; }

export function onLanguageChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function extendStrings(byLang) {
  for (const [lang, dict] of Object.entries(byLang)) {
    _strings[lang] = { ..._strings[lang], ...dict };
  }
}

export function t(key, vars) {
  const dict = _strings[_lang] || _strings.en || {};
  let out = dict[key];
  if (out == null) out = (_strings.en && _strings.en[key]) || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{{${k}}}`).join(String(v));
    }
  }
  return out;
}

// Engine strings — UI движка (Save/Share/Settings и т.д.). Приложение может
// перекрыть через extendStrings.
extendStrings({
  ru: {
    // common
    save: 'Сохранить', saved: 'Сохранено', share: 'Поделиться',
    settings: 'Настройки', back: 'Назад', cancel: 'Отмена',
    today: 'Сегодня', library: 'Сохранённое', history: 'История', profile: 'Профиль',
    tab_today: 'Сегодня', tab_library: 'Сохр.', tab_history: 'История', tab_settings: 'Настр.',
    // streak
    streak_at_risk: 'Стрик в опасности',
    streak_today_done: 'Сегодня уже отмечено',
    streak_count: '{{count}} дн.',
    // scenario
    scenario_check_yourself: 'Проверь себя',
    votes_count_few: 'По данным {{count}} ответов',
    join_the_first: 'Ты {{n}}-й, кто ответил',
    // levels
    swipe_up_deeper: 'Свайп вверх — глубже в модель',
    level_indicator: 'Уровень {{current}} · {{total}}',
    // auth
    sign_in: 'Войти', sign_up: 'Регистрация', sign_out: 'Выйти',
    email: 'Email', password: 'Пароль',
    continue_with_google: 'Войти через Google',
    continue_with_apple:  'Войти через Apple',
    skip_for_now: 'Пропустить пока',
    // paywall
    upgrade_to_pro: 'Открыть всё',
    monthly: 'Помесячно', yearly: 'Годовая',
    restore_purchases: 'Восстановить покупки',
    // empty
    library_empty: 'Сохранённых карточек пока нет',
    history_empty: 'История появится после первой карточки',
    // settings sections
    other_studio_apps: 'Другие приложения студии',
    notifications: 'Уведомления',
    daily_reminder: 'Ежедневное напоминание',
    consent_analytics: 'Аналитика',
    consent_crash_reports: 'Отчёты о сбоях',
    language: 'Язык',
    // errors
    network_error: 'Нет соединения',
    try_again: 'Попробовать снова'
  },
  en: {
    save: 'Save', saved: 'Saved', share: 'Share',
    settings: 'Settings', back: 'Back', cancel: 'Cancel',
    today: 'Today', library: 'Library', history: 'History', profile: 'Profile',
    tab_today: 'Today', tab_library: 'Library', tab_history: 'History', tab_settings: 'Settings',
    streak_at_risk: 'Streak at risk',
    streak_today_done: 'Already done today',
    streak_count: '{{count}} d.',
    scenario_check_yourself: 'Test yourself',
    votes_count_few: 'Based on {{count}} responses',
    join_the_first: 'You\'re #{{n}} to answer',
    swipe_up_deeper: 'Swipe up — deeper into the model',
    level_indicator: 'Level {{current}} of {{total}}',
    sign_in: 'Sign in', sign_up: 'Sign up', sign_out: 'Sign out',
    email: 'Email', password: 'Password',
    continue_with_google: 'Continue with Google',
    continue_with_apple:  'Continue with Apple',
    skip_for_now: 'Skip for now',
    upgrade_to_pro: 'Unlock everything',
    monthly: 'Monthly', yearly: 'Yearly',
    restore_purchases: 'Restore purchases',
    library_empty: 'Nothing saved yet',
    history_empty: 'History appears after your first card',
    other_studio_apps: 'Other studio apps',
    notifications: 'Notifications',
    daily_reminder: 'Daily reminder',
    consent_analytics: 'Analytics',
    consent_crash_reports: 'Crash reports',
    language: 'Language',
    network_error: 'No connection',
    try_again: 'Try again'
  }
});

export default { t, setLanguage, getLanguage, extendStrings, onLanguageChange };
