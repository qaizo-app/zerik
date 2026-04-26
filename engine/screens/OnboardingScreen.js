// OnboardingScreen — три слайда первого запуска. Контент — slides prop из приложения.

import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen({ slides, onDone, onConsentReminders }) {
  const { palette, tokens, brand } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const isLast = activeIndex === slides.length - 1;

  function handleNext() {
    if (isLast) {
      onConsentReminders?.(true);
      onDone?.();
    } else {
      const next = activeIndex + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, idx) => String(idx)}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setActiveIndex(Math.round(x / SCREEN_WIDTH));
        }}
        renderItem={({ item }) => (
          <View style={{
            width: SCREEN_WIDTH,
            paddingTop: insets.top + 64,
            paddingHorizontal: 32,
            justifyContent: 'flex-start'
          }}>
            <Text style={{
              fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 2.5,
              color: palette.accent, textTransform: 'uppercase', marginBottom: 24
            }}>{item.eyebrow || (brand?.app?.name || 'Mental Models')}</Text>
            <Text style={{
              fontFamily: tokens.fonts.serif_display, fontSize: 32,
              color: palette.text, marginBottom: 16, lineHeight: 32 * 1.1
            }}>{item.title}</Text>
            <Text style={{
              fontFamily: tokens.fonts.serif_body, fontSize: 16, lineHeight: 16 * 1.6,
              color: palette.text_dim
            }}>{item.body}</Text>
          </View>
        )}
      />

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingBottom: insets.bottom + 24
      }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {slides.map((_, idx) => (
            <View key={idx} style={{
              width: idx === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: idx === activeIndex ? palette.accent : palette.border_bright
            }} />
          ))}
        </View>

        <Pressable onPress={handleNext} style={{
          backgroundColor: palette.accent,
          paddingVertical: 12, paddingHorizontal: 24,
          borderRadius: tokens.radius.tight
        }}>
          <Text style={{
            fontFamily: tokens.fonts.mono_medium, fontSize: 11, letterSpacing: 2,
            color: palette.ink_on_accent, textTransform: 'uppercase'
          }}>{isLast ? t('onboarding_start') : t('onboarding_next')}</Text>
        </Pressable>
      </View>
    </View>
  );
}
