// Один экран карточки. Свайп-навигация (горизонтально между карточками,
// вертикально между уровнями глубины) — следующий шаг через CardStackScreen.
// Этот экран — для тестирования рендера одной карточки.

import { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import BlockRenderer from '../blocks/BlockRenderer';

export default function CardScreen({ card, locale = 'ru', dynamic }) {
  const { palette, tokens, setCategory } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (card?.category) setCategory(card.category);
  }, [card?.category, setCategory]);

  if (!card) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: palette.text_mute, fontFamily: tokens.fonts.mono }}>NO CARD</Text>
      </View>
    );
  }

  const localeContent = card.i18n?.[locale] || card.i18n?.en || Object.values(card.i18n || {})[0];
  const blocks = localeContent?.blocks || [];

  const releaseDateLabel = card.release_date
    ? new Date(card.release_date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { weekday: 'short', day: '2-digit', month: 'short' })
    : '';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.topbar, {
        borderBottomColor: palette.border,
        paddingHorizontal: 24
      }]}>
        <Text style={{
          fontFamily: tokens.fonts.mono,
          fontSize: tokens.fontSizes.topbar,
          letterSpacing: 1.3,
          color: palette.accent,
          textTransform: 'uppercase'
        }}>
          {(locale === 'ru' ? 'Выпуск ' : 'Issue ') + String(card.release_number).padStart(3, '0')}
        </Text>
        <Text style={{
          fontFamily: tokens.fonts.mono,
          fontSize: tokens.fontSizes.topbar,
          letterSpacing: 1.3,
          color: palette.text_mute,
          textTransform: 'uppercase'
        }}>
          {releaseDateLabel}
        </Text>
        <Text style={{
          fontFamily: tokens.fonts.mono,
          fontSize: tokens.fontSizes.topbar,
          letterSpacing: 1.3,
          color: palette.text_dim,
          textTransform: 'uppercase'
        }}>
          🔥 {dynamic?.streak ?? 0}
        </Text>
      </View>

      <BlockRenderer blocks={blocks} card={card} locale={locale} dynamic={dynamic} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1
  }
});
