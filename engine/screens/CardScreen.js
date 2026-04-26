// Один экран карточки. Свайп-навигация (горизонтально между карточками,
// вертикально между уровнями глубины) — через CardStackScreen.
//
// Каждая карточка обёрнута в CardThemeScope чтобы её палитра не зависела от
// глобального ThemeContext.category — это критично для плавного перехода
// палитры при свайпе между карточками разных категорий.

import { CardThemeScope, useTheme } from '../theme/ThemeContext';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlockRenderer from '../blocks/BlockRenderer';
import CardBottomBar from '../components/CardBottomBar';

export default function CardScreen({ card, locale = 'ru', dynamic, isSaved, onSave, onShare }) {
  return (
    <CardThemeScope category={card?.category} cardId={card?.id}>
      <CardScreenInner
        card={card} locale={locale} dynamic={dynamic}
        isSaved={isSaved} onSave={onSave} onShare={onShare}
      />
    </CardThemeScope>
  );
}

function CardScreenInner({ card, locale, dynamic, isSaved, onSave, onShare }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();

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

      <CardBottomBar
        card={card}
        isSaved={isSaved}
        onSavePress={onSave}
        onSharePress={onShare}
        showSwipeUpHint={Array.isArray(card.levels) && card.levels.length > 1}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1
  }
});
