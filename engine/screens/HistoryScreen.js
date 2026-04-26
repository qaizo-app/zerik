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

export default function HistoryScreen({ getHistory, onCardPress, locale = 'ru' }) {
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
          }}>{cards.length}</Text>
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
          data={cards}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <HistoryItem card={item} locale={locale} onPress={() => onCardPress?.(item)} />
          )}
        />
      )}
    </View>
  );
}
