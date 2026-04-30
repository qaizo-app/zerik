// HistoryScreen — пройденные карточки. Тот же UI что у Library, отличается
// только источником данных и пустым стейтом.

import { useEffect, useState } from 'react';
import { FlatList, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePalette } from '../theme/usePalette';
import { t } from '../i18n';

function formatHistoryDate(dateStr, locale) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: '2-digit', month: 'short' });
  } catch (e) {
    return dateStr;
  }
}

function HistoryItem({ card, locale, onPress }) {
  const palette = usePalette(card.category);
  const { tokens } = useTheme();
  const localeContent = card.i18n?.[locale] || Object.values(card.i18n || {})[0];
  const titleBlock = (localeContent?.blocks || []).find(b => b.type === 'title');
  const titleText = titleBlock?.props?.text?.replace(/\{\{accent:([^}]+)\}\}/g, '$1') || card.id;

  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center'
    }}>
      <View style={{ width: 4, alignSelf: 'stretch', backgroundColor: palette.accent, opacity: 0.6 }} />
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 10,
        letterSpacing: 1.4,
        color: palette.text_mute,
        textTransform: 'uppercase',
        width: 56
      }}>{formatHistoryDate(card.release_date, locale)}</Text>
      <Text style={{
        flex: 1,
        fontFamily: tokens.fonts.serif_body,
        fontSize: 15,
        color: palette.text
      }}>{titleText}</Text>
    </Pressable>
  );
}

function LockedRow({ hiddenCount, onPress }) {
  const { palette, tokens } = useTheme();
  // Если есть реально скрытые карточки — конкретное число.
  // Если архив пока меньше или равен лимиту — общая фраза о растущем архиве.
  const hintKey = hiddenCount > 0 ? 'unlock_archive_hint' : 'unlock_archive_hint_growing';
  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 22,
      paddingHorizontal: 24,
      borderTopWidth: 1,
      borderTopColor: palette.border_bright,
      alignItems: 'center',
      backgroundColor: palette.bg_card
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono_medium,
        fontSize: 11,
        letterSpacing: 2,
        color: palette.accent,
        textTransform: 'uppercase',
        marginBottom: 6
      }}>🔒 {t('unlock_archive')}</Text>
      <Text style={{
        fontFamily: tokens.fonts.serif_italic,
        fontStyle: 'italic',
        fontSize: 13,
        color: palette.text_dim,
        textAlign: 'center'
      }}>{t(hintKey, { count: hiddenCount })}</Text>
    </Pressable>
  );
}

export default function HistoryScreen({
  getHistory, onCardPress, locale = 'ru',
  // Pro-gating: если true, FlatList обрезается до lockedTailLimit и снизу
  // показывается lock-row. Тап → onUnlock (обычно: navigate to Paywall).
  lockedTail = false,
  lockedTailLimit = 7,
  onUnlock = null
}) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getHistory();
        if (!cancelled) { setCards(list); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setCards([]); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [getHistory]);

  const visibleCards = lockedTail ? cards.slice(0, lockedTailLimit) : cards;
  const hiddenCount  = lockedTail ? Math.max(cards.length - lockedTailLimit, 0) : 0;
  // lock-row показываем всегда когда gating включён — даже если архив пока
  // меньше лимита. Free-юзер должен видеть value prop постоянно.
  const showLockedRow = lockedTail;

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 24, paddingVertical: 24, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={{
          fontFamily: tokens.fonts.serif_display,
          fontSize: 28,
          color: palette.text
        }}>{t('history')}</Text>
        {cards.length > 0 ? (
          <Text style={{
            fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.4,
            color: palette.text_mute, textTransform: 'uppercase'
          }}>{lockedTail && hiddenCount > 0 ? `${visibleCards.length}/${cards.length}` : cards.length}</Text>
        ) : null}
      </View>

      {!loading && cards.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{
            fontFamily: tokens.fonts.serif_italic,
            fontStyle: 'italic',
            fontSize: 14,
            color: palette.text_mute
          }}>{t('history_empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={visibleCards}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <HistoryItem card={item} locale={locale} onPress={() => onCardPress?.(item)} />
          )}
          ListFooterComponent={showLockedRow ? (
            <LockedRow hiddenCount={hiddenCount} onPress={onUnlock} />
          ) : null}
        />
      )}
    </View>
  );
}
