import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, useFocusEffect } from '@react-navigation/native';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';

import {
  ThemeProvider,
  LibraryScreen, HistoryScreen, AuthScreen,
  PaywallScreen, OnboardingScreen, SettingsScreen,
  AppNavigator, RootStackNavigator,
  setLanguage, useLanguage,
  consentService, pushService, appCheckService,
  pluralizeDaysUpper,
} from '@engine';

import { CavilCard } from './src/CavilCard';
import { CavilLibrary } from './src/CavilLibrary';
import { CavilPractice } from './src/CavilPractice';
import { categoryPalettes } from './config/theme.config';
import { brand }       from './config/brand.config';
import { push }        from './config/push.config';
import { studioApps }  from './config/studioLineup.config';
import { onboardingSlides } from './src/onboardingSlides';
import {
  contentService, progressService,
  authService, paywallService
} from './src/services';
import { seedCards } from './src/seed';
import appJson from './app.json';

const ONBOARDING_KEY   = 'cavil:onboarding_done';
const AUTH_SKIPPED_KEY = 'cavil:auth_skipped';
const ENROLLMENT_KEY   = 'cavil:enrollment_date';

function patchCardBlocks(c) {
  const patched = { ...c, i18n: {} };
  for (const [l, content] of Object.entries(c.i18n || {})) {
    patched.i18n[l] = {
      ...content,
      blocks: [
        { type: 'title', props: { text: content.title } },
        ...(content.blocks || []),
      ],
    };
  }
  return patched;
}

const BG     = '#161420';
const ACCENT = '#9E9BC4';
const MONO   = Platform.OS === 'ios' ? 'Menlo' : 'monospace';
const TEXT_DIM  = '#A8A4C0';
const TEXT_MUTE = '#6E6A88';

function detectLanguage() {
  try {
    const locales = Localization.getLocales();
    if (locales?.[0]?.languageCode === 'ru') return 'ru';
  } catch (e) {}
  return 'en';
}

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
  return Math.max(0, diff);
}

export default function App() {
  const [fontsReady,      setFontsReady]      = useState(false);
  const [bootReady,       setBootReady]        = useState(false);
  const [initialRoute,    setInitialRoute]     = useState('Onboarding');
  const [user,            setUser]             = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigationRef  = useRef(null);
  const notifPending   = useRef(false);

  useEffect(() => {
    Font.loadAsync({
      'Inter-Regular':       require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Bold':          require('./assets/fonts/Inter-Bold.ttf'),
      'Inter-Medium':        require('./assets/fonts/Inter-Medium.ttf'),
      'SourceSerif-Regular': require('./assets/fonts/SourceSerif4-Regular.ttf'),
      'SourceSerif-Bold':    require('./assets/fonts/SourceSerif4-Bold.ttf'),
      'SourceSerif-Italic':  require('./assets/fonts/SourceSerif4-It.ttf'),
    }).then(() => setFontsReady(true)).catch(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response?.notification?.request?.content?.data?.type === 'daily_card') {
        notifPending.current = true;
      }
    });
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      navigationRef.current?.navigate('Main');
    });
    return () => sub.remove();
  }, []);

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

  useEffect(() => {
    (async () => {
      setLanguage(detectLanguage());
      appCheckService.activate().catch(() => {});

      const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
      setInitialRoute(onboarded === 'true' ? 'Main' : 'Onboarding');

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
    return (
      <View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={ACCENT} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: BG }}>
        <ThemeProvider categoryPalettes={categoryPalettes} brand={brand} defaultCategory="rhetorical_fallacies">
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
              colors: {
                ...DarkTheme.colors,
                background:   BG,
                card:         BG,
                border:       BG,
                primary:      ACCENT,
                text:         '#F0F4F8',
                notification: '#E05252',
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
                      const lang  = detectLanguage();
                      const texts = push.defaults?.[lang] || push.defaults?.en || {};
                      await pushService.scheduleDailyReminder({
                        hour:   push.defaultDailyHour   ?? 9,
                        minute: push.defaultDailyMinute ?? 0,
                        title:  texts.daily_title,
                        body:   texts.daily_body,
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
                CardViewer: ({ navigation, route }) => (
                  <CardViewerScreen
                    card={route.params?.card}
                    onClose={() => navigation.goBack()}
                  />
                ),
                Main: () => (
                  <AppNavigator
                    screens={{
                      Today: ({ navigation }) => (
                        <TodayTabScreen navigation={navigation} hasSubscription={hasSubscription} />
                      ),
                      Library: ({ navigation }) => {
                        const lang = useLanguage();
                        const [savedIds,  setSavedIds]  = useState([]);
                        const [openedIds, setOpenedIds] = useState([]);
                        const [todayIdx,  setTodayIdx]  = useState(0);
                        useFocusEffect(useCallback(() => {
                          (async () => {
                            const enrollment = await getEnrollmentDate();
                            const idx = dayIndexFromEnrollment(enrollment) + 1;
                            setTodayIdx(idx);
                            const [saved, opened] = await Promise.all([
                              progressService.getSavedIds(),
                              progressService.getOpenedIds(),
                            ]);
                            setSavedIds(saved || []);
                            setOpenedIds(opened || []);
                          })();
                        }, []));
                        return (
                          <CavilLibrary
                            locale={lang}
                            allCards={seedCards}
                            todayIndex={todayIdx}
                            savedIds={savedIds}
                            openedIds={openedIds}
                            totalVolume={VOL_TOTAL}
                            onCardPress={(card) => navigation.getParent()?.navigate('CardViewer', { card })}
                          />
                        );
                      },
                      History: ({ navigation }) => {
                        const lang = useLanguage();
                        const [streak,      setStreak]      = useState({ current: 0, best: 0 });
                        const [openedCount, setOpenedCount] = useState(0);
                        const [savedCount,  setSavedCount]  = useState(0);
                        useFocusEffect(useCallback(() => {
                          (async () => {
                            try {
                              const [s, opened, saved] = await Promise.all([
                                progressService.getStreak(),
                                progressService.getOpenedIds(),
                                progressService.getSavedIds(),
                              ]);
                              setStreak(s || { current: 0, best: 0 });
                              setOpenedCount((opened || []).length);
                              setSavedCount((saved || []).length);
                            } catch (e) {}
                          })();
                        }, []));
                        return (
                          <CavilPractice
                            locale={lang}
                            streak={streak}
                            openedCount={openedCount}
                            savedCount={savedCount}
                            totalVolume={VOL_TOTAL}
                          />
                        );
                      },
                      Settings: ({ navigation }) => (
                        <SettingsScreen
                          studioApps={studioApps}
                          currentAppSlug="cavil"
                          pushDefaults={push}
                          user={user}
                          hasSubscription={hasSubscription}
                          appVersion={appJson.expo.version}
                          updateInfo={{
                            channel:  Updates.channel  || null,
                            updateId: Updates.updateId || null,
                          }}
                          onClearedCache={() => { try { Updates.reloadAsync(); } catch (e) {} }}
                          onSignIn={() => navigation.getParent()?.navigate('Auth')}
                          onSignOut={() => authService.logout()}
                          onDeleteAccount={() => authService.deleteAccount()}
                          onOpenPaywall={() => navigation.getParent()?.navigate('Paywall')}
                        />
                      ),
                    }}
                  />
                ),
              }}
            />
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const VOL_TOTAL = 100;

function TodayTabScreen({ hasSubscription }) {
  const lang   = useLanguage();
  const insets = useSafeAreaInsets();
  const [todayIndex, setTodayIndex] = useState(null);
  const [viewIndex,  setViewIndex]  = useState(null);
  const [viewCard,   setViewCard]   = useState(null);
  const [streak,     setStreak]     = useState({ current: 0 });
  const [savedIds,   setSavedIds]   = useState([]);

  const { width: SW, height: SH } = Dimensions.get('window');
  const cardWidth  = SW - 28;
  const headerH    = insets.top + 14 + 24 + 14;   // safe area + padding + label + spacing
  const tabBarH    = 70;
  const cardHeight = SH - headerH - tabBarH - 24;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const enrollment = await getEnrollmentDate();
      const idx = dayIndexFromEnrollment(enrollment) + 1; // 1-based
      const card = await contentService.getCardByOrder(idx);
      const [streakNow, ids] = await Promise.all([
        progressService.getStreak(),
        progressService.getSavedIds(),
      ]);
      if (!cancelled) {
        setTodayIndex(idx);
        setViewIndex(idx);
        setViewCard(card);
        setStreak(streakNow);
        setSavedIds(ids || []);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Reload card when navigating prev/next
  useEffect(() => {
    if (!viewIndex) return;
    let cancelled = false;
    (async () => {
      const card = await contentService.getCardByOrder(viewIndex);
      if (!cancelled) setViewCard(card);
    })();
    return () => { cancelled = true; };
  }, [viewIndex]);

  // Record opened + refresh streak when viewing a card
  useEffect(() => {
    if (!viewCard?.id) return;
    (async () => {
      try {
        await progressService.recordCardOpened(viewCard.id);
        const s = await progressService.getStreak();
        setStreak(s);
      } catch (e) {}
    })();
  }, [viewCard?.id]);

  if (!viewCard) {
    return (
      <View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={ACCENT} size="large" />
      </View>
    );
  }

  const daysWord = pluralizeDaysUpper(streak.current, lang);
  const positionLabel = `CAVIL · № ${String(viewIndex || 0).padStart(3, '0')} / ${VOL_TOTAL}`;

  const canPrev = viewIndex > 1;
  const canNext = viewIndex < todayIndex;
  const isSaved = savedIds.includes(viewCard.id);

  const onPrev    = () => { if (canPrev) setViewIndex(viewIndex - 1); };
  const onNext    = () => { if (canNext) setViewIndex(viewIndex + 1); };
  const onCollect = async () => {
    try {
      await progressService.toggleSaved(viewCard.id);
      const ids = await progressService.getSavedIds();
      setSavedIds(ids || []);
    } catch (e) {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Top bar — combined: CAVIL · № NNN / 100  ·  ♦ N DAYS */}
      <View style={{
        paddingTop: insets.top + 14,
        paddingHorizontal: 24,
        paddingBottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1.8,
          color: TEXT_DIM,
        }}>{positionLabel}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: ACCENT, fontSize: 10 }}>♦</Text>
          <Text style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 1.6,
            color: ACCENT,
          }}>{streak.current} {daysWord}</Text>
        </View>
      </View>

      {/* Thin divider — sits below the top bar, replaces the card border */}
      <View style={{ height: 1, backgroundColor: 'rgba(158, 155, 196, 0.20)', marginHorizontal: 24 }} />

      {/* Card area — swipe left/right to navigate days */}
      <GestureDetector gesture={
        Gesture.Pan()
          .activeOffsetX([-20, 20])
          .onEnd((e) => {
            'worklet';
            if (e.translationX < -80 && canNext) runOnJS(onNext)();
            else if (e.translationX > 80 && canPrev) runOnJS(onPrev)();
          })
      }>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <CavilCard
            card={viewCard}
            locale={lang}
            width={cardWidth}
            height={cardHeight}
            dayNumber={viewIndex}
            totalCards={VOL_TOTAL}
            saved={isSaved}
            onSave={onCollect}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

function CardViewerScreen({ card, onClose }) {
  const lang   = useLanguage();
  const insets = useSafeAreaInsets();
  const { width: SW, height: SH } = Dimensions.get('window');
  const cardWidth  = SW - 28;
  const cardHeight = SH - insets.top - insets.bottom - 70;

  if (!card) return null;

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 24,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <Pressable onPress={onClose} style={{ padding: 8 }}>
          <Text style={{ fontFamily: MONO, fontSize: 14, color: TEXT_DIM, letterSpacing: 1 }}>✕</Text>
        </Pressable>
      </View>
      <View style={{ alignItems: 'center' }}>
        <CavilCard
          card={card}
          locale={lang}
          width={cardWidth}
          height={cardHeight}
          dayNumber={card.order ?? null}
          totalCards={VOL_TOTAL}
        />
      </View>
    </View>
  );
}
