// AppNavigator — bottom-tabs (Today / Library / History / Settings) над
// фуллскрин stack-модалями (Auth / Paywall / Onboarding).
// Сценарии входа управляются на уровне App.js (через флаги в AsyncStorage),
// этот компонент рендерится только когда мы внутри основного приложения.

import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function tabIcon(label, focused, palette, fonts) {
  return (
    <Text style={{
      fontFamily: focused ? fonts.mono_medium : fonts.mono,
      fontSize: 9,
      letterSpacing: 1.5,
      color: focused ? palette.accent : palette.text_mute,
      textTransform: 'uppercase',
      marginTop: 2
    }}>{label}</Text>
  );
}

export default function AppNavigator({ screens }) {
  const { palette, tokens } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: palette.bg,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 10,
          paddingBottom: 10
        }
      }}
    >
      <Tab.Screen name="Today" component={screens.Today}
        options={{ tabBarIcon: ({ focused }) => tabIcon(t('today'), focused, palette, tokens.fonts) }}
      />
      <Tab.Screen name="Library" component={screens.Library}
        options={{ tabBarIcon: ({ focused }) => tabIcon(t('library'), focused, palette, tokens.fonts) }}
      />
      <Tab.Screen name="History" component={screens.History}
        options={{ tabBarIcon: ({ focused }) => tabIcon(t('history'), focused, palette, tokens.fonts) }}
      />
      <Tab.Screen name="Settings" component={screens.Settings}
        options={{ tabBarIcon: ({ focused }) => tabIcon(t('settings'), focused, palette, tokens.fonts) }}
      />
    </Tab.Navigator>
  );
}

export function RootStackNavigator({ screens, initialRoute }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Onboarding" component={screens.Onboarding} />
      <Stack.Screen name="Auth"       component={screens.Auth}       options={{ presentation: 'modal' }} />
      <Stack.Screen name="Paywall"    component={screens.Paywall}    options={{ presentation: 'modal' }} />
      <Stack.Screen name="Main"       component={screens.Main} />
    </Stack.Navigator>
  );
}
