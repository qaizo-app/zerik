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

function StudioAppCard({ app, locale }) {
  const palette = usePalette(app.category_slug);
  const { tokens } = useTheme();
  const i18n = app.i18n?.[locale] || app.i18n?.en || {};
  const url = app.store_url || (app.store_id_android
    ? `https://play.google.com/store/apps/details?id=${app.store_id_android}`
    : '');

  return (
    <Pressable
      onPress={() => url && Linking.openURL(url)}
      style={{
        marginHorizontal: 24, marginVertical: 8,
        padding: 18, borderRadius: tokens.radius.tight,
        borderLeftWidth: 3, borderLeftColor: palette.accent,
        backgroundColor: palette.bg_card
      }}
    >
      <Text style={{
        fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 2,
        color: palette.accent, textTransform: 'uppercase', marginBottom: 6
      }}>
        {app.is_flagship ? 'Flagship' : 'App'}
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

  useEffect(() => {
    consentService.load().then(() => {
      setAnalyticsOk(consentService.getAnalyticsConsent());
      setCrashOk(consentService.getCrashReportsConsent());
      setRemindersOk(consentService.getReminderConsent());
    });
  }, []);

  async function toggleReminders(v) {
    setRemindersOk(v);
    await consentService.setReminderConsent(v);
    if (v) {
      const granted = await pushService.requestPermission();
      if (granted && pushDefaults) {
        await pushService.setupAndroidChannel();
        await pushService.scheduleDailyReminder({
          hour: pushDefaults.defaultDailyHour,
          minute: pushDefaults.defaultDailyMinute,
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

  function flipLang() {
    const next = lang === 'ru' ? 'en' : 'ru';
    setLang(next); setLanguage(next);
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

      <SectionHeader>{t('profile')}</SectionHeader>
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

      <SectionHeader>{t('language')}</SectionHeader>
      <Row label={t('language')} value={t('language_name')} onPress={flipLang} />

      <SectionHeader>{t('notifications')}</SectionHeader>
      <Row label={t('daily_reminder')} right={<Switch value={remindersOk} onValueChange={toggleReminders} />} />

      <SectionHeader>{`${t('consent_analytics')} & ${t('consent_crash_reports')}`}</SectionHeader>
      <Row label={t('consent_analytics')}     right={<Switch value={analyticsOk} onValueChange={toggleAnalytics} />} />
      <Row label={t('consent_crash_reports')} right={<Switch value={crashOk}     onValueChange={toggleCrash} />} />

      {otherApps.length > 0 ? (
        <>
          <SectionHeader>{t('other_studio_apps')}</SectionHeader>
          {otherApps.map(app => (
            <StudioAppCard key={app.slug} app={app} locale={lang} />
          ))}
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

      <Text style={{
        marginTop: 24, paddingHorizontal: 24, paddingBottom: 16,
        fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 1.4,
        color: palette.text_mute, textTransform: 'uppercase', textAlign: 'center'
      }}>
        {brand?.app?.name || 'Mental Models'}
      </Text>
    </ScrollView>
  );
}
