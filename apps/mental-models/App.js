import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';

import {
  ThemeProvider, useTheme,
  registerEngineBlocks,
  CardLevelStack, LibraryScreen, HistoryScreen, AuthScreen,
  PaywallScreen, OnboardingScreen, SettingsScreen, CardViewerScreen,
  AppNavigator, RootStackNavigator,
  setLanguage, getLanguage, useLanguage,
  consentService, pushService, appCheckService,
  usePalette,
  t
} from '@engine';

import { categoryPalettes } from './config/theme.config';
import { brand } from './config/brand.config';
import appJson from './app.json';
import { push }  from './config/push.config';
import { studioApps } from './config/studioLineup.config';
import { onboardingSlides } from './src/onboardingSlides';
import { registerAppIllustrations } from './illustrations';
import { registerAppBlocks } from './blocks';
import { seedCards, resolveLevels } from './src/seed';
import {
  contentService, votingService, progressService,
  authService, paywallService
} from './src/services';

registerEngineBlocks();
registerAppBlocks();
registerAppIllustrations();

const ONBOARDING_KEY   = 'mm:onboarding_done';
const AUTH_SKIPPED_KEY = 'mm:auth_skipped';
const ENROLLMENT_KEY   = 'mm:enrollment_date';

// seed — по убыванию дат (новейшие первыми). Разворачиваем для user-relative порядка.
// CARDS_ASC[0] = Day 1 (старейшая карточка), CARDS_ASC[N] = Day N+1.
const CARDS_ASC = [...seedCards].reverse().map((c, i) => ({ ...c, order: i + 1 }));

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function getEnrollmentDate() {
  let date = await AsyncStorage.getItem(ENROLLMENT_KEY);
  if (!date) {
    date = todayIso();
    await AsyncStorage.setItem(ENROLLMENT_KEY, date);
  }
  return date;
}

function dayIndexFromEnrollment(enrollmentDate) {
  const diff = Math.floor((new Date() - new Date(enrollmentDate)) / 86400000);
  return Math.max(0, Math.min(diff, CARDS_ASC.length - 1));
}

function detectLanguage() {
  try {
    const locales = Localization.getLocales();
    const code = locales?.[0]?.languageCode;
    if (code === 'ru') return 'ru';
  } catch (e) {}
  return 'en';
}

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);
  const [bootReady, setBootReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Onboarding');
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigationRef = useRef(null);
  const notifPending = useRef(false);

  // Fonts
  useEffect(() => {
    Font.loadAsync({
      'Prata-Regular':         require('./assets/fonts/Prata-Regular.ttf'),
      'Spectral-Light':        require('./assets/fonts/Spectral-Light.ttf'),
      'Spectral-Regular':      require('./assets/fonts/Spectral-Regular.ttf'),
      'Spectral-Italic':       require('./assets/fonts/Spectral-Italic.ttf'),
      'Spectral-Medium':       require('./assets/fonts/Spectral-Medium.ttf'),
      'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
      'JetBrainsMono-Medium':  require('./assets/fonts/JetBrainsMono-Medium.ttf'),
      'JetBrainsMono-Bold':    require('./assets/fonts/JetBrainsMono-Bold.ttf'),
    }).then(() => setFontsReady(true)).catch(() => setFontsReady(true));
  }, []);

  // Notification tap handler (foreground/background + cold start)
  useEffect(() => {
    // Cold start: app was killed, user tapped notification
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response?.notification?.request?.content?.data?.type === 'daily_card') {
        notifPending.current = true;
      }
    });
    // Foreground/background tap
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      navigationRef.current?.navigate('Main');
    });
    return () => sub.remove();
  }, []);

  // OTA update check — только в production-сборках, dev-client подключается к Metro.
  useEffect(() => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) return;
    (async () => {
      try {
        const upd = await Updates.checkForUpdateAsync();
        if (upd.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {}
    })();
  }, []);

  // Initial state
  useEffect(() => {
    (async () => {
      setLanguage(detectLanguage());
      appCheckService.activate().catch(() => {});

      const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
      const skipped   = await AsyncStorage.getItem(AUTH_SKIPPED_KEY);

      if (onboarded !== 'true') {
        setInitialRoute('Onboarding');
      } else {
        setInitialRoute('Main');
      }

      // Auth state listener (если firebase доступен)
      try {
        authService.onAuthChanged(async (u) => {
          setUser(u);
          if (u) {
            try { await progressService.migrateGuestToCloud(); } catch (e) {}
            try { await paywallService.configure(u.uid); } catch (e) {}
            try { setHasSubscription(await paywallService.hasActiveSubscription()); } catch (e) {}
          } else {
            try { await paywallService.configure(null); } catch (e) {}
          }
        });
      } catch (e) {}

      setBootReady(true);
    })();
  }, []);

  if (!fontsReady || !bootReady) {
    return <View style={{ flex: 1, backgroundColor: '#0E1014' }} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0E1014' }}>
        <ThemeProvider categoryPalettes={categoryPalettes} brand={brand}>
          <StatusBar style="light" />
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              if (notifPending.current) {
                notifPending.current = false;
                navigationRef.current?.navigate('Main');
              }
            }}
            theme={{
            ...DarkTheme,
            dark: true,
            colors: {
              ...DarkTheme.colors,
              background: '#0E1014',
              card: '#0E1014',
              border: '#0E1014',
              primary: '#5EEAD4',
              text: '#E4E7EC',
              notification: '#F87171'
            }
          }}>
            <RootStackNavigator
              initialRoute={initialRoute}
              screens={{
                Onboarding: ({ navigation }) => (
                  <OnboardingScreen
                    slides={onboardingSlides[detectLanguage()] || onboardingSlides.en}
                    onConsentReminders={async (granted) => {
                      await consentService.setReminderConsent(!!granted);
                      if (!granted) return;
                      const ok = await pushService.requestPermission();
                      if (!ok) return;
                      await pushService.setupAndroidChannel();
                      const lang = detectLanguage();
                      const texts = push.defaults?.[lang] || push.defaults?.en || {};
                      await pushService.scheduleDailyReminder({
                        hour: push.defaultDailyHour ?? 9,
                        minute: push.defaultDailyMinute ?? 0,
                        title: texts.daily_title,
                        body:  texts.daily_body
                      });
                    }}
                    onDone={async () => {
                      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
                      navigation.replace('Main');
                    }}
                  />
                ),
                Auth: ({ navigation }) => (
                  <AuthScreen
                    authService={authService}
                    onSuccess={() => navigation.goBack()}
                    onSkip={async () => {
                      await AsyncStorage.setItem(AUTH_SKIPPED_KEY, 'true');
                      navigation.goBack();
                    }}
                  />
                ),
                Paywall: ({ navigation }) => (
                  <PaywallScreen
                    paywallService={paywallService}
                    onPurchased={() => { setHasSubscription(true); navigation.goBack(); }}
                    onClose={() => navigation.goBack()}
                  />
                ),
                Main: () => (
                  <AppNavigator
                    screens={{
                      Today: ({ navigation }) => <TodayTabScreen navigation={navigation} hasSubscription={hasSubscription} />,
                      Library: ({ navigation }) => {
                        const lang = useLanguage();
                        return (
                          <LibraryScreen
                            locale={lang}
                            getSavedCards={async () => {
                              const ids = await progressService.getSavedIds();
                              const out = [];
                              for (const id of ids) {
                                const c = await contentService.getCardById(id);
                                if (c) out.push(c);
                              }
                              return out;
                            }}
                            onCardPress={(card) => navigation.getParent()?.navigate('CardViewer', { cardId: card.id })}
                          />
                        );
                      },
                      History: ({ navigation }) => {
                        const lang = useLanguage();
                        return (
                          <HistoryScreen
                            locale={lang}
                            getHistory={async () => {
                              const openedIds = await progressService.getOpenedIds();
                              if (!openedIds.length) return [];
                              const cards = await Promise.all(openedIds.map(id => contentService.getCardById(id)));
                              const orderMap = Object.fromEntries(CARDS_ASC.map(c => [c.id, c.order]));
                              return cards
                                .filter(Boolean)
                                .sort((a, b) => (orderMap[b.id] || 0) - (orderMap[a.id] || 0));
                            }}
                            onCardPress={(card) => navigation.getParent()?.navigate('CardViewer', { cardId: card.id })}
                            lockedTail={!hasSubscription}
                            lockedTailLimit={7}
                            onUnlock={() => navigation.getParent()?.navigate('Paywall')}
                          />
                        );
                      },
                      Settings: ({ navigation }) => (
                        <SettingsScreen
                          studioApps={studioApps}
                          currentAppSlug="senik"
                          pushDefaults={push}
                          user={user}
                          hasSubscription={hasSubscription}
                          appVersion={appJson.expo.version}
                          updateInfo={{
                            channel:  Updates.channel || null,
                            updateId: Updates.updateId || null
                          }}
                          onClearedCache={() => {
                            try { Updates.reloadAsync(); } catch (e) {}
                          }}
                          onSignIn={() => navigation.getParent()?.navigate('Auth')}
                          onSignOut={() => authService.logout()}
                          onDeleteAccount={() => authService.deleteAccount()}
                          onOpenPaywall={() => navigation.getParent()?.navigate('Paywall')}
                        />
                      )
                    }}
                  />
                ),
                CardViewer: ({ route, navigation }) => {
                  const lang = useLanguage();
                  return (
                  <CardViewerScreen
                    route={route}
                    navigation={navigation}
                    contentService={contentService}
                    locale={lang}
                    resolveLevels={resolveLevels}
                  />
                  );
                }
              }}
            />
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function TodayTabScreen({ navigation, hasSubscription }) {
  const lang = useLanguage();
  const { setCategory } = useTheme();
  const [cards, setCards] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [streak, setStreak] = useState({ current: 0, best: 0, at_risk: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const enrollment = await getEnrollmentDate();
      const idx = dayIndexFromEnrollment(enrollment);
      const todayCard = CARDS_ASC[idx];
      const earlier = CARDS_ASC.slice(0, idx).reverse().slice(0, 5);
      const list = [todayCard, ...earlier].filter(Boolean);
      const [ids, streakNow] = await Promise.all([
        progressService.getSavedIds(),
        progressService.getStreak(),
      ]);
      if (!cancelled) {
        setCards(list);
        setSavedIds(ids);
        setStreak(streakNow);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Синхронизируем глобальную категорию с карточкой дня — чтобы таб-бар
  // и прочий внекарточный UI окрашивался в её палитру.
  // Также фиксируем просмотр карточки дня (обновляет streak) и
  // перечитываем актуальное значение, чтобы 🔥 на топбаре было корректным.
  useEffect(() => {
    const top = cards?.[0];
    if (!top) return;
    if (top.category) setCategory(top.category);
    if (!top.id) return;
    (async () => {
      try {
        await progressService.recordCardOpened(top.id);
        const s = await progressService.getStreak();
        setStreak(s);
      } catch (e) {}
    })();
  }, [cards, setCategory]);

  async function handleSave(card) {
    const next = await progressService.toggleSaved(card.id);
    setSavedIds(next?.saved_card_ids || []);
  }

  async function handleShare(card) {
    const { shareService } = await import('@engine');
    await shareService.shareCard(null, {
      card,
      locale: lang,
      fallbackUrl: `https://zerik.app/cards/${card.id}`
    }).catch(() => {});
  }

  if (!cards) return (
    <View style={{ flex: 1, backgroundColor: '#0E1014', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#5EEAD4" size="large" />
    </View>
  );

  const today = cards[0];
  const earlier = cards.slice(1);
  const isSaved = today ? savedIds.includes(today.id) : false;

  if (!today) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0E1014', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: '#9AA0A6', fontFamily: 'Spectral-Italic', fontStyle: 'italic', fontSize: 14, textAlign: 'center' }}>
          {t('no_card_today')}
        </Text>
      </View>
    );
  }

  const todayLevels = resolveLevels(today);
  const screenWidth = Dimensions.get('window').width;

  return (
    <CardLevelStack
      levels={todayLevels}
      width={screenWidth}
      locale={lang}
      dynamic={{ streak: streak.current }}
      isSaved={isSaved}
      onSave={() => handleSave(today)}
      onShare={() => handleShare(today)}
      hasSubscription={hasSubscription}
      onLockedDeeper={() => navigation?.getParent()?.navigate('Paywall')}
      extraBottomSection={
        earlier.length > 0 ? (
          <EarlierStrip
            cards={earlier}
            locale={lang}
            onCardPress={(c) => navigation?.getParent()?.navigate('CardViewer', { cardId: c.id })}
          />
        ) : null
      }
    />
  );
}

function EarlierStrip({ cards, locale, onCardPress }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{ paddingTop: 8, paddingBottom: 12 }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 11,
        letterSpacing: 1.6,
        color: palette.text_mute,
        textTransform: 'uppercase',
        paddingHorizontal: 24,
        paddingBottom: 12
      }}>{t('earlier_this_week')}</Text>

      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <EarlierCard card={item} locale={locale} onPress={() => onCardPress?.(item)} />
        )}
      />
    </View>
  );
}

function EarlierCard({ card, locale, onPress }) {
  const cardPalette = usePalette(card.category);
  const { tokens } = useTheme();
  const localeContent = card.i18n?.[locale] || Object.values(card.i18n || {})[0];
  const titleBlock = (localeContent?.blocks || []).find(b => b.type === 'title');
  const titleText = titleBlock?.props?.text?.replace(/\{\{accent:([^}]+)\}\}/g, '$1') || card.id;
  const dateLabel = card.order ? (locale === 'ru' ? `День ${card.order}` : `Day ${card.order}`) : '';

  return (
    <Pressable onPress={onPress} style={{
      width: 180,
      marginHorizontal: 8,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: tokens.radius.tight,
      borderWidth: 1,
      borderColor: cardPalette.border,
      backgroundColor: cardPalette.bg_card
    }}>
      <View style={{ height: 3, width: 28, backgroundColor: cardPalette.accent, marginBottom: 10, opacity: 0.8 }} />
      <Text numberOfLines={3} style={{
        fontFamily: tokens.fonts.serif_body,
        fontSize: 14,
        lineHeight: 18,
        color: cardPalette.text,
        marginBottom: 10
      }}>{titleText}</Text>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 9.5,
        letterSpacing: 1.4,
        color: cardPalette.text_mute,
        textTransform: 'uppercase'
      }}>{dateLabel}</Text>
    </Pressable>
  );
}
