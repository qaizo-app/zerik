// AppNavigator — bottom-tabs (Today / Library / History / Settings) над
// фуллскрин stack-модалями (Auth / Paywall / Onboarding).
// Сценарии входа управляются на уровне App.js (через флаги в AsyncStorage),
// этот компонент рендерится только когда мы внутри основного приложения.

import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function tabLabel(label, focused, palette, fonts) {
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: focused ? fonts.mono_medium : fonts.mono,
        fontSize: 13,
        letterSpacing: 0,
        color: focused ? palette.accent : palette.text_dim,
        textAlign: 'center',
        transform: [{ translateY: -10 }]  // поднимает текст на 10px вверх
      }}
    >{label}</Text>
  );
}

export default function AppNavigator({ screens }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();

  // Android gesture bar — на MIUI/Samsung One UI insets.bottom часто = 0,
  // минимум 65 поднимает текст табов высоко над системной полосой жестов.
  // Высота tab bar и позиция текста независимы.
  // Позицию текста контролирует transform: translateY в tabLabel (выше).
  // Здесь только высота bar и safe area для gesture bar.
  const paddingTop          = 4;
  const contentHeight       = 50;
  const itemPaddingBottom   = 0;
  const paddingBottom       = Math.max(insets.bottom + 4, 16);
  const totalHeight         = paddingTop + contentHeight + paddingBottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: palette.bg,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          height: totalHeight,
          paddingTop,
          paddingBottom
        },
        tabBarItemStyle: {
          paddingTop: 0,
          paddingBottom: itemPaddingBottom,
          paddingHorizontal: 4
        }
      }}
    >
      <Tab.Screen name="Today" component={screens.Today}
        options={{
          tabBarIcon: () => null,
          tabBarLabel: ({ focused }) => tabLabel(t('tab_today'), focused, palette, tokens.fonts)
        }}
      />
      <Tab.Screen name="Library" component={screens.Library}
        options={{
          tabBarIcon: () => null,
          tabBarLabel: ({ focused }) => tabLabel(t('tab_library'), focused, palette, tokens.fonts)
        }}
      />
      <Tab.Screen name="History" component={screens.History}
        options={{
          tabBarIcon: () => null,
          tabBarLabel: ({ focused }) => tabLabel(t('tab_history'), focused, palette, tokens.fonts)
        }}
      />
      <Tab.Screen name="Settings" component={screens.Settings}
        options={{
          tabBarIcon: () => null,
          tabBarLabel: ({ focused }) => tabLabel(t('tab_settings'), focused, palette, tokens.fonts)
        }}
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
