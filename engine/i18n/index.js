// Минималистичный i18n движка. Поддерживает {{var}}-подстановки.
// Приложение мерджит свои строки сверху через extendStrings().
//
// Не используем react-i18next/intl чтобы не тащить лишний bundle. Когда понадобится
// плюрализация и сложные форматы — мигрируем на одно из них без боли.

import { useEffect, useState } from 'react';

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

// React hook — компоненты subscribed на этот hook пере-рендериваются
// при смене языка. Используется в AppNavigator/Tab labels чтобы UI
// обновлялся без выхода-входа в экран.
export function useLanguage() {
  const [lang, setLangState] = useState(_lang);
  useEffect(() => onLanguageChange(setLangState), []);
  return lang;
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
    earlier_this_week: 'Ранее на этой неделе',
    no_card_today: 'Сегодня новая карточка ещё не вышла',
    issue_label: 'Выпуск',
    guest: 'Гость',
    language_name: 'Русский',
    onboarding_next: 'Дальше →',
    onboarding_start: 'Старт →',
    coming_soon_badge: 'Скоро',
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
    level_label: 'Уровень',
    level_intro: 'Глубже в модель — биология, формализация, исключения',
    go_deeper: 'Глубже в модель',
    go_deeper_hint: 'Биология, формализация, исключения · ~3 мин',
    go_deeper_biology: 'Что в мозге',
    go_deeper_biology_hint: 'Нейронаука и биохимия · ~3 мин',
    go_deeper_case_study: 'Историческая хроника',
    go_deeper_case_study_hint: 'Реальный случай · ~5 мин',
    go_deeper_boundaries: 'Когда модель ломается',
    go_deeper_boundaries_hint: 'Границы применимости · ~3 мин',
    go_deeper_apply_drill: 'Применить к себе',
    go_deeper_apply_drill_hint: 'Пошаговый разбор твоей ситуации',
    go_deeper_connections: 'Связанные модели',
    go_deeper_connections_hint: 'Карта смежных концепций',
    go_deeper_sources: 'Источники',
    go_deeper_sources_hint: 'Книги, статьи, оригинальные работы',
    back_to_level_1: 'К уровню 1',
    // auth
    sign_in: 'Войти', sign_up: 'Регистрация', sign_out: 'Выйти',
    email: 'Email', password: 'Пароль',
    continue_with_google: 'Войти через Google',
    continue_with_apple:  'Войти через Apple',
    skip_for_now: 'Пропустить пока',
    delete_account: 'Удалить аккаунт',
    delete: 'Удалить',
    delete_account_warning: 'Аккаунт и все связанные данные будут удалены без возможности восстановления. Подписка Google Play не отменяется автоматически — отмени её отдельно в Play Store.',
    delete_account_reauth: 'Для удаления аккаунта нужна свежая авторизация. Выйди из аккаунта и зайди снова, потом попробуй ещё раз.',
    delete_account_error: 'Не удалось удалить аккаунт. Попробуй ещё раз или напиши нам.',
    // paywall
    upgrade_to_pro: 'Открыть всё',
    monthly: 'Помесячно', yearly: 'Годовая',
    restore_purchases: 'Восстановить покупки',
    paywall_subtitle: 'Все модели мышления. Без ограничений.',
    paywall_feature_archive_title: 'Полный архив',
    paywall_feature_archive_body: 'Все ранее выпущенные модели — а не только последние 7 дней.',
    paywall_feature_depth_title: 'Глубокие уровни',
    paywall_feature_depth_body: 'Биология, формализация, исторические кейсы, источники.',
    paywall_feature_support_title: 'Поддержка независимой студии',
    paywall_feature_support_body: 'Ты помогаешь нам делать новые модели каждый день — без рекламы и трекеров.',
    locked_deeper_hint: 'Pro · биология, кейсы, источники',
    unlock_archive: 'Открыть весь архив',
    unlock_archive_hint: 'Ещё {{count}} моделей за подпиской',
    unlock_archive_hint_growing: 'Архив растёт каждый день. С Pro — все модели, навсегда.',
    // empty
    library_empty: 'Сохранённых карточек пока нет',
    history_empty: 'История появится после первой карточки',
    // settings sections
    other_studio_apps: 'Другие приложения студии',
    notifications: 'Уведомления',
    daily_reminder: 'Ежедневное напоминание',
    test_push: 'Тест уведомления',
    test_push_body: 'Если ты это видишь — push настроен корректно.',
    consent_analytics: 'Аналитика',
    consent_crash_reports: 'Отчёты о сбоях',
    language: 'Язык',
    // about
    about: 'О приложении',
    privacy_policy: 'Политика конфиденциальности',
    terms_of_service: 'Условия использования',
    support: 'Поддержка',
    version: 'Версия',
    update_channel: 'Канал обновлений',
    update_id: 'ID обновления',
    clear_cache: 'Очистить кэш',
    clear_cache_warning: 'Будут удалены все локальные данные: прогресс, настройки, сохранённые карточки, расписание уведомлений. Действие необратимо.',
    // errors
    network_error: 'Нет соединения',
    try_again: 'Попробовать снова',
    not_found: 'Карточка не найдена'
  },
  en: {
    save: 'Save', saved: 'Saved', share: 'Share',
    settings: 'Settings', back: 'Back', cancel: 'Cancel',
    today: 'Today', library: 'Library', history: 'History', profile: 'Profile',
    tab_today: 'Today', tab_library: 'Library', tab_history: 'History', tab_settings: 'Settings',
    earlier_this_week: 'Earlier this week',
    no_card_today: 'No new card today yet',
    issue_label: 'Issue',
    guest: 'Guest',
    language_name: 'English',
    onboarding_next: 'Next →',
    onboarding_start: 'Start →',
    coming_soon_badge: 'Coming soon',
    streak_at_risk: 'Streak at risk',
    streak_today_done: 'Already done today',
    streak_count: '{{count}} d.',
    scenario_check_yourself: 'Test yourself',
    votes_count_few: 'Based on {{count}} responses',
    join_the_first: 'You\'re #{{n}} to answer',
    swipe_up_deeper: 'Swipe up — deeper into the model',
    level_indicator: 'Level {{current}} of {{total}}',
    level_label: 'Level',
    level_intro: 'Deeper into the model — biology, formalization, edge cases',
    go_deeper: 'Go deeper',
    go_deeper_hint: 'Biology, formalization, edge cases · ~3 min',
    go_deeper_biology: 'The neuroscience',
    go_deeper_biology_hint: 'What the brain does · ~3 min',
    go_deeper_case_study: 'Historical case',
    go_deeper_case_study_hint: 'A real story · ~5 min',
    go_deeper_boundaries: 'When the model breaks',
    go_deeper_boundaries_hint: 'Limits and edge cases · ~3 min',
    go_deeper_apply_drill: 'Apply to yourself',
    go_deeper_apply_drill_hint: 'Step-by-step on your situation',
    go_deeper_connections: 'Related models',
    go_deeper_connections_hint: 'Map of adjacent concepts',
    go_deeper_sources: 'Sources',
    go_deeper_sources_hint: 'Books, papers, original work',
    back_to_level_1: 'Back to level 1',
    sign_in: 'Sign in', sign_up: 'Sign up', sign_out: 'Sign out',
    email: 'Email', password: 'Password',
    continue_with_google: 'Continue with Google',
    continue_with_apple:  'Continue with Apple',
    skip_for_now: 'Skip for now',
    delete_account: 'Delete account',
    delete: 'Delete',
    delete_account_warning: 'Your account and all associated data will be permanently deleted. This cannot be undone. Your Google Play subscription is not cancelled automatically — cancel it separately in Play Store.',
    delete_account_reauth: 'For security, please sign out and sign in again before deleting your account.',
    delete_account_error: 'Could not delete account. Please try again or contact support.',
    upgrade_to_pro: 'Unlock everything',
    monthly: 'Monthly', yearly: 'Yearly',
    restore_purchases: 'Restore purchases',
    paywall_subtitle: 'Every mental model. No limits.',
    paywall_feature_archive_title: 'Full archive',
    paywall_feature_archive_body: 'Every model ever released — not just the last 7 days.',
    paywall_feature_depth_title: 'Deeper levels',
    paywall_feature_depth_body: 'The biology, the formalization, historical cases, sources.',
    paywall_feature_support_title: 'Support an indie studio',
    paywall_feature_support_body: 'You help us release new models every day — no ads, no trackers.',
    locked_deeper_hint: 'Pro · biology, cases, sources',
    unlock_archive: 'Unlock the full archive',
    unlock_archive_hint: '{{count}} more models behind Pro',
    unlock_archive_hint_growing: 'The archive grows every day. Pro keeps it open forever.',
    library_empty: 'Nothing saved yet',
    history_empty: 'History appears after your first card',
    other_studio_apps: 'Other studio apps',
    notifications: 'Notifications',
    daily_reminder: 'Daily reminder',
    test_push: 'Test notification',
    test_push_body: 'If you see this — push is working.',
    consent_analytics: 'Analytics',
    consent_crash_reports: 'Crash reports',
    language: 'Language',
    about: 'About',
    privacy_policy: 'Privacy policy',
    terms_of_service: 'Terms of service',
    support: 'Support',
    version: 'Version',
    update_channel: 'Update channel',
    update_id: 'Update ID',
    clear_cache: 'Clear cache',
    clear_cache_warning: 'This will delete all local data: progress, settings, saved cards, scheduled notifications. Action is irreversible.',
    network_error: 'No connection',
    try_again: 'Try again',
    not_found: 'Card not found'
  }
});

export default { t, setLanguage, getLanguage, extendStrings, onLanguageChange, useLanguage };
