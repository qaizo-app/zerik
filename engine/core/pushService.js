// PushService — локальные напоминания через expo-notifications + remote push
// через @react-native-firebase/messaging.
//
// Локальные напоминания для daily-карточки (фиксированное время, выбираемое
// пользователем) — не требуют сервера.
//
// Remote push — для маркетинговых кампаний и системных событий (новый продукт
// студии, апдейт). Обернёт FCM, отправка с сервера/Cloud Functions.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import consentService from './consentService';
import { getItem, setItem } from './storage';

const DAILY_REMINDER_KEY = 'zerik:push:daily_reminder_id';
const STREAK_ALERT_KEY   = 'zerik:push:streak_alert_id';
const PREF_KEY = 'zerik:push:prefs';

let _messaging = null;
try {
  _messaging = require('@react-native-firebase/messaging').default;
} catch (e) {}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export const pushService = {

  async getPreferences() {
    return await getItem(PREF_KEY, {
      daily_enabled: true,
      daily_hour: 9,
      daily_minute: 0,
      streak_alerts: true,
      weekly_digest: true
    });
  },

  async setPreferences(patch) {
    const current = await this.getPreferences();
    const next = { ...current, ...patch };
    await setItem(PREF_KEY, next);
    return next;
  },

  // ─── permission ─────────────────────────────────────────────────────────

  async requestPermission() {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.status === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async setupAndroidChannel() {
    if (Platform.OS !== 'android') return;
    try {
      await Notifications.setNotificationChannelAsync('daily-card', {
        name: 'Daily Card',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: null
      });
      await Notifications.setNotificationChannelAsync('streak', {
        name: 'Streak Alerts',
        importance: Notifications.AndroidImportance.HIGH
      });
    } catch (e) {
      if (__DEV__) console.warn('[pushService.setupAndroidChannel]', e?.message);
    }
  },

  // ─── local: instant test ────────────────────────────────────────────────

  async fireTestNotification({ title, body } = {}) {
    try {
      const ok = await this.requestPermission();
      if (!ok) return false;
      await this.setupAndroidChannel();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'Test',
          body:  body  || 'It works.',
          data:  { kind: 'test' }
        },
        trigger: { seconds: 3, channelId: 'daily-card' }
      });
      return true;
    } catch (e) {
      if (__DEV__) console.warn('[pushService.fireTestNotification]', e?.message);
      return false;
    }
  },

  // ─── local: daily reminder ──────────────────────────────────────────────

  async scheduleDailyReminder({ hour, minute, title, body }) {
    if (!consentService.getReminderConsent()) return null;

    // Отменяем предыдущий, если был.
    const oldId = await getItem(DAILY_REMINDER_KEY, null);
    if (oldId) {
      try { await Notifications.cancelScheduledNotificationAsync(oldId); } catch (e) {}
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: { title, body, data: { type: 'daily_card' } },
        trigger: {
          type: 'daily',
          hour, minute,
          channelId: 'daily-card'
        }
      });
      await setItem(DAILY_REMINDER_KEY, id);
      return id;
    } catch (e) {
      if (__DEV__) console.warn('[pushService.scheduleDailyReminder]', e?.message);
      return null;
    }
  },

  async cancelDailyReminder() {
    const id = await getItem(DAILY_REMINDER_KEY, null);
    if (id) {
      try { await Notifications.cancelScheduledNotificationAsync(id); } catch (e) {}
      await setItem(DAILY_REMINDER_KEY, null);
    }
  },

  // ─── streak alert ──────────────────────────────────────────────────────
  // Один раз в день, вечером, если стрик в опасности (карточка сегодня
  // не открыта). Вызывать из progressService после record/check streak.

  async scheduleStreakAlert({ hour = 20, minute = 0, title, body, streak } = {}) {
    if (!consentService.getReminderConsent()) return null;

    // Отменяем старый перед записью нового, чтобы не плодить дубликаты.
    const oldId = await getItem(STREAK_ALERT_KEY, null);
    if (oldId) {
      try { await Notifications.cancelScheduledNotificationAsync(oldId); } catch (e) {}
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'Streak at risk',
          body:  body  || (streak ? `${streak}-day streak. One card to keep it.` : 'One card today.'),
          data:  { type: 'streak_alert', streak: streak || 0 }
        },
        trigger: {
          type: 'daily',
          hour, minute,
          channelId: 'streak'
        }
      });
      await setItem(STREAK_ALERT_KEY, id);
      return id;
    } catch (e) {
      if (__DEV__) console.warn('[pushService.scheduleStreakAlert]', e?.message);
      return null;
    }
  },

  async cancelStreakAlert() {
    const id = await getItem(STREAK_ALERT_KEY, null);
    if (id) {
      try { await Notifications.cancelScheduledNotificationAsync(id); } catch (e) {}
      await setItem(STREAK_ALERT_KEY, null);
    }
  },

  async cancelAll() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await setItem(DAILY_REMINDER_KEY, null);
      await setItem(STREAK_ALERT_KEY, null);
    } catch (e) {}
  },

  // ─── remote: FCM ────────────────────────────────────────────────────────

  async getFcmToken() {
    if (!_messaging) return null;
    try {
      await _messaging().requestPermission();
      return await _messaging().getToken();
    } catch (e) {
      return null;
    }
  },

  onTokenRefresh(callback) {
    if (!_messaging) return () => {};
    return _messaging().onTokenRefresh(callback);
  },

  onMessage(callback) {
    if (!_messaging) return () => {};
    return _messaging().onMessage(callback);
  }
};

export default pushService;
