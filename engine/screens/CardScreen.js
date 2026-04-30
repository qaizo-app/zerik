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
  noTopInset = false,        // когда родитель уже учёл safe area top (CardViewer header)
  // CardLevelStack opt-in deeper навигация (Variant A):
  onContinueDeeper = null,
  onBackToParent  = null,
  levelLabel      = null,
  deeperType      = null,
  // Pro-gating для «Go deeper». Если lockedDeeper=true — кнопка показывает 🔒
  // и при тапе зовёт onLockedDeeper (обычно: navigate to Paywall).
  lockedDeeper    = false,
  onLockedDeeper  = null,
  // Доп. секция, вставляется внутри ScrollView после CardBottomBar.
  // Используется на Today для мини-списка «Earlier this week».
  extraBottomSection = null
}) {
  return (
    <CardThemeScope category={card?.category} cardId={card?.id}>
      <CardScreenInner
        card={card} locale={locale} dynamic={dynamic}
        isSaved={isSaved} onSave={onSave} onShare={onShare}
        noScroll={noScroll} noTopInset={noTopInset}
        onContinueDeeper={onContinueDeeper}
        onBackToParent={onBackToParent}
        levelLabel={levelLabel}
        deeperType={deeperType}
        lockedDeeper={lockedDeeper}
        onLockedDeeper={onLockedDeeper}
        extraBottomSection={extraBottomSection}
      />
    </CardThemeScope>
  );
}

function CardScreenInner({ card, locale, dynamic, isSaved, onSave, onShare, noScroll, noTopInset, onContinueDeeper, onBackToParent, levelLabel, deeperType, lockedDeeper, onLockedDeeper, extraBottomSection }) {
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

  const topPad = noTopInset ? 0 : insets.top;
  // Когда noScroll=true — рендерим без ScrollView, контейнер-родитель (CardLevelStack)
  // оборачивает несколько карточек в один общий ScrollView. Это устраняет конфликт
  // вложенных вертикальных scroll-жестов.
  const Container = noScroll ? View : ScrollView;
  const containerProps = noScroll
    ? { style: { backgroundColor: palette.bg, paddingTop: topPad, paddingBottom: insets.bottom + 100 } }
    : {
        style: { flex: 1, backgroundColor: palette.bg },
        contentContainerStyle: { paddingTop: topPad, paddingBottom: insets.bottom + 100 },
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

      {(onContinueDeeper || (lockedDeeper && onLockedDeeper)) ? (() => {
        const labelKey  = deeperType ? `go_deeper_${deeperType}`        : 'go_deeper';
        const hintKey   = deeperType ? `go_deeper_${deeperType}_hint`   : 'go_deeper_hint';
        const isLocked  = lockedDeeper;
        const handlePress = isLocked ? onLockedDeeper : onContinueDeeper;
        return (
          <Pressable
            onPress={handlePress}
            style={{
              marginHorizontal: 24,
              marginTop: 32,
              marginBottom: 12,
              paddingVertical: 18,
              paddingHorizontal: 20,
              borderRadius: tokens.radius.tight,
              borderWidth: 1,
              borderColor: isLocked ? palette.border_bright : palette.accent,
              backgroundColor: palette.bg_card,
              alignItems: 'center',
              opacity: isLocked ? 0.95 : 1
            }}
          >
            <Text style={{
              fontFamily: tokens.fonts.mono_medium,
              fontSize: 11,
              letterSpacing: 2,
              color: isLocked ? palette.text_dim : palette.accent,
              textTransform: 'uppercase',
              marginBottom: 6
            }}>{isLocked ? '🔒 ' : '↓ '}{t(labelKey)}</Text>
            <Text style={{
              fontFamily: tokens.fonts.serif_italic,
              fontStyle: 'italic',
              fontSize: 13,
              color: palette.text_dim,
              textAlign: 'center'
            }}>{isLocked ? t('locked_deeper_hint') : t(hintKey)}</Text>
          </Pressable>
        );
      })() : null}

      <CardBottomBar
        card={card}
        isSaved={isSaved}
        onSavePress={onSave}
        onSharePress={onShare}
        showSwipeUpHint={false}
      />

      {extraBottomSection}
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
