import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import * as Updates from 'expo-updates';

import {
  ThemeProvider,
  registerEngineBlocks,
  CardStackScreen, LibraryScreen, HistoryScreen, AuthScreen,
  PaywallScreen, OnboardingScreen, SettingsScreen,
  AppNavigator, RootStackNavigator,
  setLanguage,
  consentService, pushService, appCheckService
} from '@engine';

import { categoryPalettes } from './config/theme.config';
import { brand } from './config/brand.config';
import appJson from './app.json';
import { push }  from './config/push.config';
import { studioApps } from './config/studioLineup.config';
import { onboardingSlides } from './src/onboardingSlides';
import { registerAppIllustrations } from './illustrations';
import { registerAppBlocks } from './blocks';
import { resolveLevels } from './src/seed';
import {
  contentService, votingService, progressService,
  authService, paywallService
} from './src/services';

registerEngineBlocks();
registerAppBlocks();
registerAppIllustrations();

const ONBOARDING_KEY = 'mm:onboarding_done';
const AUTH_SKIPPED_KEY = 'mm:auth_skipped';

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
          <NavigationContainer theme={{
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
                      Today: () => <TodayTabScreen />,
                      Library: () => (
                        <LibraryScreen
                          locale={detectLanguage()}
                          getSavedCards={async () => {
                            const ids = await progressService.getSavedIds();
                            const out = [];
                            for (const id of ids) {
                              const c = await contentService.getCardById(id);
                              if (c) out.push(c);
                            }
                            return out;
                          }}
                        />
                      ),
                      History: () => (
                        <HistoryScreen
                          locale={detectLanguage()}
                          getHistory={async () => contentService.getCardChain({ limit: 50 })}
                        />
                      ),
                      Settings: ({ navigation }) => (
                        <SettingsScreen
                          studioApps={studioApps}
                          currentAppSlug="mental_models"
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
                          onOpenPaywall={() => navigation.getParent()?.navigate('Paywall')}
                        />
                      )
                    }}
                  />
                )
              }}
            />
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function TodayTabScreen() {
  const [cards, setCards] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await contentService.getCardChain({ limit: 20 });
      const ids  = await progressService.getSavedIds();
      if (!cancelled) {
        setCards(list);
        setSavedIds(ids);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSave(card) {
    const next = await progressService.toggleSaved(card.id);
    setSavedIds(next?.saved_card_ids || []);
  }

  async function handleShare(card) {
    const { shareService } = await import('@engine');
    // viewRef можно прокинуть через CardStackScreen.onActiveCardCaptureRefChange
    // когда подключим image-capture (рефакторинг CardScreen в forwardRef).
    // Сейчас shareService падает на URL fallback автоматически.
    await shareService.shareCard(null, {
      card,
      locale: 'ru',
      fallbackUrl: `https://zerik.app/cards/${card.id}`
    }).catch(() => {});
  }

  if (!cards) return <View style={{ flex: 1, backgroundColor: '#0E1014' }} />;

  return (
    <CardStackScreen
      cards={cards}
      locale="ru"
      savedIds={savedIds}
      onSavePress={handleSave}
      onSharePress={handleShare}
      resolveLevels={resolveLevels}
      onCardOpened={(id) => {
        progressService.recordCardOpened(id).catch(() => {});
      }}
    />
  );
}
