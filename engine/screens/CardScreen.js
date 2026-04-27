// Один экран карточки. Свайп-навигация (горизонтально между карточками,
// вертикально между уровнями глубины) — через CardStackScreen.
//
// Каждая карточка обёрнута в CardThemeScope чтобы её палитра не зависела от
// глобального ThemeContext.category — это критично для плавного перехода
// палитры при свайпе между карточками разных категорий.

import { CardThemeScope, useTheme } from '../theme/ThemeContext';
import { Pressable, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlockRenderer from '../blocks/BlockRenderer';
import CardBottomBar from '../components/CardBottomBar';
import { t } from '../i18n';

export default function CardScreen({
  card, locale = 'ru', dynamic, isSaved, onSave, onShare,
  noScroll = false,
  // CardLevelStack opt-in deeper навигация (Variant A):
  onContinueDeeper = null,   // если задан — внизу карточки кнопка "↓ Глубже"
  onBackToParent  = null,    // если задан — сверху ссылка "← К Уровню 1"
  levelLabel      = null     // строка для шапки если показываем "УРОВЕНЬ 2" и т.п.
}) {
  return (
    <CardThemeScope category={card?.category} cardId={card?.id}>
      <CardScreenInner
        card={card} locale={locale} dynamic={dynamic}
        isSaved={isSaved} onSave={onSave} onShare={onShare}
        noScroll={noScroll}
        onContinueDeeper={onContinueDeeper}
        onBackToParent={onBackToParent}
        levelLabel={levelLabel}
      />
    </CardThemeScope>
  );
}

function CardScreenInner({ card, locale, dynamic, isSaved, onSave, onShare, noScroll, onContinueDeeper, onBackToParent, levelLabel }) {
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

  // Когда noScroll=true — рендерим без ScrollView, контейнер-родитель (CardLevelStack)
  // оборачивает несколько карточек в один общий ScrollView. Это устраняет конфликт
  // вложенных вертикальных scroll-жестов.
  const Container = noScroll ? View : ScrollView;
  const containerProps = noScroll
    ? { style: { backgroundColor: palette.bg, paddingTop: insets.top, paddingBottom: insets.bottom + 100 } }
    : {
        style: { flex: 1, backgroundColor: palette.bg },
        contentContainerStyle: { paddingTop: insets.top, paddingBottom: insets.bottom + 100 },
        showsVerticalScrollIndicator: false
      };

  return (
    <Container {...containerProps}>
      {onBackToParent ? (
        <Pressable
          onPress={onBackToParent}
          style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}
          hitSlop={12}
        >
          <Text style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 11,
            letterSpacing: 1.6,
            color: palette.accent,
            textTransform: 'uppercase'
          }}>← {t('back_to_level_1')}</Text>
        </Pressable>
      ) : null}

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
          {levelLabel || t('issue_label') + ' ' + String(card.release_number).padStart(3, '0')}
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

      {onContinueDeeper ? (
        <Pressable
          onPress={onContinueDeeper}
          style={{
            marginHorizontal: 24,
            marginTop: 32,
            marginBottom: 12,
            paddingVertical: 18,
            paddingHorizontal: 20,
            borderRadius: tokens.radius.tight,
            borderWidth: 1,
            borderColor: palette.accent,
            backgroundColor: palette.bg_card,
            alignItems: 'center'
          }}
        >
          <Text style={{
            fontFamily: tokens.fonts.mono_medium,
            fontSize: 11,
            letterSpacing: 2,
            color: palette.accent,
            textTransform: 'uppercase',
            marginBottom: 6
          }}>↓ {t('go_deeper')}</Text>
          <Text style={{
            fontFamily: tokens.fonts.serif_italic,
            fontStyle: 'italic',
            fontSize: 13,
            color: palette.text_dim,
            textAlign: 'center'
          }}>{t('go_deeper_hint')}</Text>
        </Pressable>
      ) : null}

      <CardBottomBar
        card={card}
        isSaved={isSaved}
        onSavePress={onSave}
        onSharePress={onShare}
        showSwipeUpHint={false}
      />
    </Container>
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
