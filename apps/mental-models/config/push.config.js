// Push-конфиг для Senik. Тексты — только дефолты, пользователь меняет
// время в SettingsScreen. Локализация — из i18n приложения.

export const push = {
  defaultDailyHour: 9,
  defaultDailyMinute: 0,
  streakAlertHour: 20,
  streakAlertMinute: 0,
  defaults: {
    ru: {
      daily_title: 'Senik',
      daily_body:  'Карточка дня готова — пара минут и готово',
      streak_title: 'Стрик в опасности',
      streak_body:  '{{streak}} дней подряд. Одна карточка — и продолжишь.'
    },
    en: {
      daily_title: 'Senik',
      daily_body:  'Today\'s card is ready — two minutes and you\'re done',
      streak_title: 'Streak at risk',
      streak_body:  '{{streak}} days going. One card to keep it.'
    }
  }
};
