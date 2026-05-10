// SettingsScreen — общие настройки + cross-promotion другими приложениями студии.

import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePalette } from '../theme/usePalette';
import { t, setLanguage, getLanguage } from '../i18n';
import consentService from '../core/consentService';
import pushService from '../core/pushService';
import * as storage from '../core/storage';
import TimePickerModal from '../components/TimePickerModal';

function SectionHeader({ children }) {
  const { palette, tokens } = useTheme();
  return (
    <Text style={{
      paddingTop: 24, paddingHorizontal: 24, paddingBottom: 8,
      fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 2.4,
      color: palette.text_mute, textTransform: 'uppercase'
    }}>{children}</Text>
  );
}

function Row({ label, value, onPress, right }) {
  const { palette, tokens } = useTheme();
  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 14, paddingHorizontal: 24,
      borderTopWidth: 1, borderTopColor: palette.border,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Text style={{
        fontFamily: tokens.fonts.serif_body, fontSize: 15.5, color: palette.text
      }}>{label}</Text>
      {right ?? (value ? (
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.4,
          color: palette.text_dim, textTransform: 'uppercase'
        }}>{value}</Text>
      ) : null)}
    </Pressable>
  );
}

function StudioAppRow({ app, locale, dim }) {
  const sub = usePalette(app.category_slug);
  const { palette, tokens } = useTheme();
  const i18n = app.i18n?.[locale] || app.i18n?.en || {};
  const url = app.store_url || (app.store_id_android
    ? `https://play.google.com/store/apps/details?id=${app.store_id_android}`
    : '');
  const tappable = !!url && !dim;

  return (
    <Pressable
      onPress={tappable ? (() => Linking.openURL(url)) : null}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: sub.accent, opacity: dim ? 0.6 : 1 }} />
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: tokens.fonts.serif_display, fontSize: 14,
          color: dim ? palette.text_dim : palette.text
        }}>{i18n.name}</Text>
        <Text style={{
          fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
          fontSize: 12, color: palette.text_mute
        }}>{i18n.tagline}</Text>
      </View>
    </Pressable>
  );
}

function OtherAppsDisclosure({ apps, locale, label }) {
  const { palette, tokens } = useTheme();
  const [expanded, setExpanded] = useState(false);
  if (!apps.length) return null;

  const released = apps.filter(a => !a.coming_soon);
  const upcoming = apps.filter(a => a.coming_soon);

  return (
    <View style={{
      marginHorizontal: 24,
      marginVertical: 8,
      borderRadius: tokens.radius.tight,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
    }}>
      <Pressable
        onPress={() => setExpanded(v => !v)}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 2,
          color: palette.text_dim, textTransform: 'uppercase'
        }}>
          {label} · {apps.length}
        </Text>
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 13,
          color: palette.text_mute,
        }}>
          {expanded ? '▾' : '▸'}
        </Text>
      </Pressable>
      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14, paddingTop: 2 }}>
          {released.map(app => (
            <StudioAppRow key={app.slug} app={app} locale={locale} dim={false} />
          ))}
          {upcoming.length > 0 && (
            <Text style={{
              marginTop: 12, marginBottom: 4,
              fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 1.6,
              color: palette.text_mute, textTransform: 'uppercase',
            }}>
              {t('coming_soon_badge')}
            </Text>
          )}
          {upcoming.map(app => (
            <StudioAppRow key={app.slug} app={app} locale={locale} dim={true} />
          ))}
        </View>
      )}
    </View>
  );
}

function StudioAppCard({ app, locale }) {
  const palette = usePalette(app.category_slug);
  const { tokens } = useTheme();
  const i18n = app.i18n?.[locale] || app.i18n?.en || {};
  const url = app.store_url || (app.store_id_android
    ? `https://play.google.com/store/apps/details?id=${app.store_id_android}`
    : '');
  const tappable = !!url && !app.coming_soon;
  const badge = app.coming_soon ? t('coming_soon_badge')
              : app.is_flagship ? 'Flagship'
              : 'App';

  return (
    <Pressable
      onPress={tappable ? (() => Linking.openURL(url)) : null}
      style={{
        marginHorizontal: 24, marginVertical: 8,
        padding: 18, borderRadius: tokens.radius.tight,
        borderLeftWidth: 3, borderLeftColor: palette.accent,
        backgroundColor: palette.bg_card,
        opacity: tappable ? 1 : 0.7
      }}
    >
      <Text style={{
        fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 2,
        color: app.coming_soon ? palette.text_mute : palette.accent,
        textTransform: 'uppercase', marginBottom: 6
      }}>
        {badge}
      </Text>
      <Text style={{
        fontFamily: tokens.fonts.serif_display, fontSize: 18,
        color: palette.text, marginBottom: 4
      }}>{i18n.name}</Text>
      <Text style={{
        fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
        fontSize: 14, color: palette.text_dim
      }}>{i18n.tagline}</Text>
    </Pressable>
  );
}

export default function SettingsScreen({
  studioApps = [],
  currentAppSlug,
  pushDefaults,
  user,
  onSignIn,
  onSignOut,
  onDeleteAccount,
  onOpenPaywall,
  hasSubscription,
  appVersion = '',
  updateInfo = null,
  onClearedCache = null
}) {
  const { palette, tokens, brand } = useTheme();
  const insets = useSafeAreaInsets();
  const [analyticsOk, setAnalyticsOk] = useState(true);
  const [crashOk, setCrashOk] = useState(true);
  const [remindersOk, setRemindersOk] = useState(false);
  const [lang, setLang] = useState(getLanguage());
  const [dailyHour,   setDailyHour]   = useState(pushDefaults?.defaultDailyHour   ?? 9);
  const [dailyMinute, setDailyMinute] = useState(pushDefaults?.defaultDailyMinute ?? 0);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  useEffect(() => {
    consentService.load().then(() => {
      setAnalyticsOk(consentService.getAnalyticsConsent());
      setCrashOk(consentService.getCrashReportsConsent());
      setRemindersOk(consentService.getReminderConsent());
    });
    pushService.getPreferences().then(prefs => {
      if (prefs?.daily_hour   !== undefined) setDailyHour(prefs.daily_hour);
      if (prefs?.daily_minute !== undefined) setDailyMinute(prefs.daily_minute);
    });
  }, []);

  async function saveReminderTime({ hour, minute }) {
    setDailyHour(hour);
    setDailyMinute(minute);
    setTimeModalOpen(false);
    try {
      await pushService.setPreferences({ daily_hour: hour, daily_minute: minute });
      if (remindersOk && pushDefaults) {
        await pushService.cancelDailyReminder();
        await pushService.scheduleDailyReminder({
          hour,
          minute,
          title: pushDefaults.defaults?.[lang]?.daily_title || '',
          body:  pushDefaults.defaults?.[lang]?.daily_body  || ''
        });
      }
    } catch (e) {}
  }

  async function toggleReminders(v) {
    setRemindersOk(v);
    await consentService.setReminderConsent(v);
    if (v) {
      const granted = await pushService.requestPermission();
      if (granted && pushDefaults) {
        await pushService.setupAndroidChannel();
        await pushService.scheduleDailyReminder({
          hour:   dailyHour,
          minute: dailyMinute,
          title: pushDefaults.defaults?.[lang]?.daily_title || '',
          body:  pushDefaults.defaults?.[lang]?.daily_body  || ''
        });
        // Streak alert вечером — отдельный канал.
        const streakBody = (pushDefaults.defaults?.[lang]?.streak_body || '').replace('{{streak}}', '0');
        await pushService.scheduleStreakAlert({
          hour:   pushDefaults.streakAlertHour ?? 20,
          minute: pushDefaults.streakAlertMinute ?? 0,
          title:  pushDefaults.defaults?.[lang]?.streak_title || '',
          body:   streakBody
        });
      }
    } else {
      await pushService.cancelDailyReminder();
      await pushService.cancelStreakAlert();
    }
  }

  async function toggleAnalytics(v) { setAnalyticsOk(v); await consentService.setAnalyticsConsent(v); }
  async function toggleCrash(v)     { setCrashOk(v);     await consentService.setCrashReportsConsent(v); }

  function setLangTo(next) {
    if (next === lang) return;
    setLang(next); setLanguage(next);
  }

  function confirmDeleteAccount() {
    if (typeof onDeleteAccount !== 'function') return;
    Alert.alert(
      t('delete_account'),
      t('delete_account_warning'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: async () => {
          const res = await onDeleteAccount();
          if (res && res.success === false) {
            const msg = res.error === 'reauth_required'
              ? t('delete_account_reauth')
              : t('delete_account_error');
            Alert.alert(t('delete_account'), msg);
          }
        }}
      ]
    );
  }

  function confirmClearCache() {
    Alert.alert(
      t('clear_cache'),
      t('clear_cache_warning'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('clear_cache'), style: 'destructive', onPress: async () => {
          try {
            await pushService.cancelDailyReminder();
            await pushService.cancelStreakAlert();
          } catch (e) {}
          await storage.clearAll();
          if (typeof onClearedCache === 'function') onClearedCache();
        }}
      ]
    );
  }

  const otherApps = studioApps.filter(a => a.slug !== currentAppSlug);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.bg }} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 32 }}>
      <Text style={{
        paddingHorizontal: 24, paddingVertical: 24,
        fontFamily: tokens.fonts.serif_display, fontSize: 28, color: palette.text
      }}>{t('settings')}</Text>

      {/* 1. ACCOUNT */}
      <SectionHeader>{t('account') || t('profile')}</SectionHeader>
      <Row
        label={user?.email || user?.displayName || t('guest')}
        right={user
          ? <Pressable onPress={onSignOut}><Text style={{ fontFamily: tokens.fonts.mono, fontSize: 11, color: palette.accent, letterSpacing: 1.4 }}>{t('sign_out').toUpperCase()}</Text></Pressable>
          : <Pressable onPress={onSignIn}><Text style={{ fontFamily: tokens.fonts.mono, fontSize: 11, color: palette.accent, letterSpacing: 1.4 }}>{t('sign_in').toUpperCase()}</Text></Pressable>
        }
      />
      {!hasSubscription ? (
        <Row label={t('upgrade_to_pro')} onPress={onOpenPaywall}
          right={<Text style={{ fontFamily: tokens.fonts.mono_medium, fontSize: 11, color: palette.accent, letterSpacing: 1.4 }}>→</Text>}
        />
      ) : null}
      {user && typeof onDeleteAccount === 'function' ? (
        <Row label={t('delete_account')} onPress={confirmDeleteAccount}
          right={<Text style={{ fontFamily: tokens.fonts.mono, fontSize: 11, color: palette.picked, letterSpacing: 1.4 }}>→</Text>}
        />
      ) : null}

      {/* 2. PREFERENCES — language + reminders + time */}
      <SectionHeader>{t('preferences') || t('notifications')}</SectionHeader>
      <Row label={t('language')} right={
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {['ru', 'en'].map(code => {
            const active = lang === code;
            return (
              <Pressable
                key={code}
                onPress={() => setLangTo(code)}
                hitSlop={8}
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  backgroundColor: active ? palette.accent : 'transparent',
                  borderWidth: 1,
                  borderColor: active ? palette.accent : palette.border_bright,
                }}
              >
                <Text style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 11,
                  letterSpacing: 1.4,
                  color: active ? palette.ink_on_accent || palette.bg : palette.text_dim,
                }}>{code.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </View>
      } />
      <Row label={t('daily_reminder')} right={<Switch
          value={remindersOk}
          onValueChange={toggleReminders}
          trackColor={{ false: palette.border, true: palette.accent_dim }}
          thumbColor={remindersOk ? palette.accent : palette.text_mute}
          ios_backgroundColor={palette.border}
        />} />
      {remindersOk ? (
        <Row
          label={t('reminder_time')}
          value={`${String(dailyHour).padStart(2, '0')}:${String(dailyMinute).padStart(2, '0')}`}
          onPress={() => setTimeModalOpen(true)}
        />
      ) : null}

      <TimePickerModal
        visible={timeModalOpen}
        initialHour={dailyHour}
        initialMinute={dailyMinute}
        title={t('reminder_time_picker_title')}
        labelHour={t('reminder_time_hour')}
        labelMinute={t('reminder_time_minute')}
        labelSave={t('save') || 'Save'}
        labelCancel={t('cancel') || 'Cancel'}
        onSave={saveReminderTime}
        onCancel={() => setTimeModalOpen(false)}
      />

      {/* 3. PRIVACY — analytics + crash reports */}
      <SectionHeader>{t('privacy')}</SectionHeader>
      <Row label={t('consent_analytics')} right={
        <Switch
          value={analyticsOk}
          onValueChange={toggleAnalytics}
          trackColor={{ false: palette.border, true: palette.accent_dim }}
          thumbColor={analyticsOk ? palette.accent : palette.text_mute}
          ios_backgroundColor={palette.border}
        />
      } />
      <Row label={t('consent_crash_reports')} right={
        <Switch
          value={crashOk}
          onValueChange={toggleCrash}
          trackColor={{ false: palette.border, true: palette.accent_dim }}
          thumbColor={crashOk ? palette.accent : palette.text_mute}
          ios_backgroundColor={palette.border}
        />
      } />

      {otherApps.length > 0 ? (
        <>
          <SectionHeader>{t('other_studio_apps')}</SectionHeader>
          <OtherAppsDisclosure apps={otherApps} locale={lang} label={t('other_studio_apps')} />
        </>
      ) : null}

      <SectionHeader>{t('about')}</SectionHeader>
      {brand?.legal?.privacyUrl ? (
        <Row label={t('privacy_policy')} onPress={() => Linking.openURL(brand.legal.privacyUrl)} />
      ) : null}
      {brand?.legal?.termsUrl ? (
        <Row label={t('terms_of_service')} onPress={() => Linking.openURL(brand.legal.termsUrl)} />
      ) : null}
      {brand?.legal?.supportEmail ? (
        <Row label={t('support')} value={brand.legal.supportEmail} onPress={() => Linking.openURL(`mailto:${brand.legal.supportEmail}`)} />
      ) : null}
      <Row label={t('version')} value={appVersion} />
      <Row label={t('clear_cache')} onPress={confirmClearCache}
        right={<Text style={{ fontFamily: tokens.fonts.mono, fontSize: 11, color: palette.picked, letterSpacing: 1.4 }}>→</Text>}
      />
      {updateInfo?.channel ? (
        <Row label={t('update_channel')} value={updateInfo.channel} />
      ) : null}
      {updateInfo?.updateId ? (
        <Row label={t('update_id')} value={String(updateInfo.updateId).slice(0, 8) + '…'} />
      ) : null}

      <View style={{ marginTop: 28, paddingHorizontal: 24, paddingBottom: 20, alignItems: 'center' }}>
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 1.8,
          color: palette.text_dim, textTransform: 'uppercase'
        }}>
          {brand?.app?.name || 'Senik'}
        </Text>
        <Text style={{
          marginTop: 6,
          fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 1.6,
          color: palette.text_mute, textTransform: 'uppercase'
        }}>
          {t('by_studio_label')}
        </Text>
      </View>
    </ScrollView>
  );
}
