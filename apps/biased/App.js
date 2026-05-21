import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
} from '@engine';

import { BiasCard } from './src/BiasCard';
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

const seedCardMap     = new Map(seedCards.map(c => [c.id, c]));
const seedCardByOrder = new Map(seedCards.map(c => [c.order, c]));

const ONBOARDING_KEY   = 'biased:onboarding_done';
const AUTH_SKIPPED_KEY = 'biased:auth_skipped';
const ENROLLMENT_KEY   = 'biased:enrollment_date';

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

const BG    = '#0D1B2A';
const ACCENT = '#E89647';

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background:   BG,
    card:         BG,
    border:       BG,
    primary:      ACCENT,
    text:         '#F0F4F8',
    notification: '#E05252',
  },
};

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
      'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
      'Inter-Bold':    require('./assets/fonts/Inter-Bold.ttf'),
      'Inter-Medium':  require('./assets/fonts/Inter-Medium.ttf'),
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
      } catch (e) { __DEV__ && console.error('[Biased]', e); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLanguage(detectLanguage());
      appCheckService.activate().catch((e) => { __DEV__ && console.error('[Biased]', e); });

      const onboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
      setInitialRoute(onboarded === 'true' ? 'Main' : 'Onboarding');

      try {
        authService.onAuthChanged(async (u) => {
          setUser(u);
          if (u) {
            try { await progressService.migrateGuestToCloud(); } catch (e) { __DEV__ && console.error('[Biased]', e); }
            try { await paywallService.configure(u.uid); } catch (e) { __DEV__ && console.error('[Biased]', e); }
            try { setHasSubscription(await paywallService.hasActiveSubscription()); } catch (e) { __DEV__ && console.error('[Biased]', e); }
          } else {
            try { await paywallService.configure(null); } catch (e) { __DEV__ && console.error('[Biased]', e); }
          }
        });
      } catch (e) { __DEV__ && console.error('[Biased]', e); }

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
        <ThemeProvider categoryPalettes={categoryPalettes} brand={brand} defaultCategory="cognitive_biases">
          <StatusBar style="light" />
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              if (notifPending.current) {
                notifPending.current = false;
                navigationRef.current?.navigate('Main');
              }
            }}
            theme={NAV_THEME}>
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
                        const [refreshKey, setRefreshKey] = useState(0);
                        useFocusEffect(useCallback(() => { setRefreshKey(k => k + 1); }, []));
                        const getSavedCards = useCallback(async () => {
                          const ids = await progressService.getSavedIds();
                          return ids
                            .map(id => seedCardMap.get(id))
                            .filter(Boolean)
                            .map(patchCardBlocks);
                        }, [refreshKey]);
                        return (
                          <LibraryScreen
                            locale={lang}
                            getSavedCards={getSavedCards}
                            onCardPress={(card) => navigation.getParent()?.navigate('CardViewer', { card })}
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
                              return openedIds
                                .map(id => seedCardMap.get(id))
                                .filter(Boolean)
                                .map(patchCardBlocks)
                                .sort((a, b) => (b.order || 0) - (a.order || 0));
                            }}
                            onCardPress={(card) => navigation.getParent()?.navigate('CardViewer', { card })}
                            lockedTail={false}
                          />
                        );
                      },
                      Settings: ({ navigation }) => (
                        <SettingsScreen
                          studioApps={studioApps}
                          currentAppSlug="biased"
                          pushDefaults={push}
                          user={user}
                          hasSubscription={hasSubscription}
                          appVersion={appJson.expo.version}
                          onClearedCache={() => { try { Updates.reloadAsync(); } catch (e) { __DEV__ && console.error('[Biased]', e); } }}
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

function TodayTabScreen({ hasSubscription }) {
  const lang   = useLanguage();
  const insets = useSafeAreaInsets();
  const [card,      setCard]      = useState(null);
  const [cardError, setCardError] = useState(false);
  const [streak,    setStreak]    = useState({ current: 0 });
  const [saved,     setSaved]     = useState(false);
  const [savedIds,  setSavedIds]  = useState([]);

  const { width: SW, height: SH } = Dimensions.get('window');
  const cardWidth  = SW - 48;
  const headerH    = insets.top + 16 + 52 + 20; // top + header row + bottom padding
  const tabBarH    = 70;
  const cardHeight = SH - headerH - tabBarH - 16;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const enrollment = await getEnrollmentDate();
        const idx = dayIndexFromEnrollment(enrollment);
        const order = idx + 1;

        // Show local card immediately — no network wait
        const localCard = seedCardByOrder.get(order);
        if (localCard && !cancelled) setCard(localCard);

        // Load streak/saved and Firestore card in parallel
        const [remoteCard, streakNow, ids] = await Promise.all([
          contentService.getCardByOrder(order).catch(() => null),
          progressService.getStreak(),
          progressService.getSavedIds(),
        ]);

        if (!cancelled) {
          if (remoteCard) setCard(remoteCard);
          else if (!localCard) setCardError(true);
          setStreak(streakNow);
          setSavedIds(ids || []);
        }
      } catch (e) {
        if (!cancelled) setCardError(true);
        __DEV__ && console.error('[Biased]', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!card?.id) return;
    let cancelled = false;
    (async () => {
      try {
        await progressService.recordCardOpened(card.id);
        const s = await progressService.getStreak();
        if (!cancelled) setStreak(s);
      } catch (e) { __DEV__ && console.error('[Biased]', e); }
    })();
    return () => { cancelled = true; };
  }, [card]);

  if (!card) {
    return (
      <View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
        {cardError
          ? <Text style={{ color: '#4A6480', fontFamily: 'Inter-Regular', fontSize: 14 }}>
              {lang === 'ru' ? 'Не удалось загрузить карточку' : "Could not load today's card"}
            </Text>
          : <ActivityIndicator color={ACCENT} size="large" />
        }
      </View>
    );
  }

  const dayNumber = card.order ?? null;
  const dateLabel = dayNumber ? (lang === 'ru' ? `День ${dayNumber}` : `Day ${dayNumber}`) : '';

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <View style={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 24,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{
            fontFamily: 'Inter-Bold',
            fontSize: 12,
            letterSpacing: 2.4,
            color: '#F0F4F8',
            textTransform: 'uppercase',
          }}>Biased</Text>
          {!!dateLabel && (
            <Text style={{
              fontFamily: 'Inter-Regular',
              fontSize: 10,
              letterSpacing: 1.4,
              color: '#4A6480',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>{dateLabel}</Text>
          )}
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#111D2B',
          borderWidth: 1,
          borderColor: '#1C2F42',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 5,
        }}>
          <Text style={{ fontSize: 13 }}>🔥</Text>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: ACCENT }}>
            {streak.current}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <BiasCard
          card={card}
          locale={lang}
          width={cardWidth}
          height={cardHeight}
          dayNumber={dayNumber}
          saved={savedIds.includes(card.id)}
          onSave={async () => {
            try {
              await progressService.toggleSaved(card.id);
              const ids = await progressService.getSavedIds();
              setSavedIds(ids || []);
            } catch (e) { __DEV__ && console.error('[Biased]', e); }
          }}
        />
      </View>
    </View>
  );
}

function CardViewerScreen({ card, onClose }) {
  const lang   = useLanguage();
  const insets = useSafeAreaInsets();
  const { width: SW, height: SH } = Dimensions.get('window');
  const cardWidth  = SW - 48;
  const cardHeight = SH - insets.top - insets.bottom - 80;

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
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: '#4A6480', letterSpacing: 1 }}>✕</Text>
        </Pressable>
      </View>
      <View style={{ alignItems: 'center' }}>
        <BiasCard
          card={card}
          locale={lang}
          width={cardWidth}
          height={cardHeight}
          dayNumber={card.order ?? null}
        />
      </View>
    </View>
  );
}
