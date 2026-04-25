// Public surface движка. Приложение импортирует только то, что отсюда экспортировано.

export { ThemeProvider, useTheme } from './theme/ThemeContext';
export { usePalette } from './theme/usePalette';
export { tokens } from './theme/tokens';

export { registerBlock, registerEngineBlocks, getBlockComponent, listRegisteredBlocks } from './blocks/registry';
export { registerIllustration, getIllustration, refToSlug } from './blocks/illustrations/registry';
export { default as BlockRenderer } from './blocks/BlockRenderer';
export { default as InlineText }    from './blocks/utils/InlineText';
export { parseInline, fillDynamic } from './blocks/utils/inlineMarkers';

export { default as CardScreen }       from './screens/CardScreen';
export { default as CardStackScreen }  from './screens/CardStackScreen';
export { default as CardBottomBar }    from './components/CardBottomBar';
export { default as LibraryScreen }    from './screens/LibraryScreen';
export { default as HistoryScreen }    from './screens/HistoryScreen';
export { default as AuthScreen }       from './screens/AuthScreen';
export { default as PaywallScreen }    from './screens/PaywallScreen';
export { default as OnboardingScreen } from './screens/OnboardingScreen';
export { default as SettingsScreen }   from './screens/SettingsScreen';

export { default as AppNavigator, RootStackNavigator } from './navigation/AppNavigator';

// Core services
export {
  hasFirebase, getFirestore, getAuth, tryFirestore, tryAuth, storage,
  ContentService, VotingService, ProgressService, AuthService, PaywallService,
  consentService, analyticsEvents, pushService
} from './core';

// i18n
export { default as i18n, t, setLanguage, getLanguage, extendStrings, onLanguageChange } from './i18n';
