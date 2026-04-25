// LibraryScreen — сохранённые карточки. Принимает getSavedCards() — функцию,
// которую приложение прокидывает (использует свой ProgressService + ContentService).

import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { usePalette } from '../theme/usePalette';
import { t } from '../i18n';

function CardListItem({ card, locale, onPress }) {
  const palette = usePalette(card.category);
  const { tokens } = useTheme();
  const localeContent = card.i18n?.[locale] || Object.values(card.i18n || {})[0];
  const titleBlock = (localeContent?.blocks || []).find(b => b.type === 'title');
  const subtitleBlock = (localeContent?.blocks || []).find(b => b.type === 'subtitle');
  const titleText = titleBlock?.props?.text?.replace(/\{\{accent:([^}]+)\}\}/g, '$1') || card.id;

  return (
    <Pressable onPress={onPress} style={{
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center'
    }}>
      <View style={{ width: 4, alignSelf: 'stretch', backgroundColor: palette.accent }} />
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: tokens.fonts.serif_display,
          fontSize: 18,
          color: palette.text,
          marginBottom: 4
        }}>{titleText}</Text>
        {subtitleBlock?.props?.text ? (
          <Text style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 10,
            letterSpacing: 1.4,
            color: palette.text_mute,
            textTransform: 'uppercase'
          }}>{subtitleBlock.props.text}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function LibraryScreen({ getSavedCards, onCardPress, locale = 'ru' }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getSavedCards();
        if (!cancelled) { setCards(list); setLoading(false); }
      } catch (e) {
        if (!cancelled) { setCards([]); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [getSavedCards]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, paddingTop: insets.top }}>
      <Text style={{
        paddingHorizontal: 24,
        paddingVertical: 24,
        fontFamily: tokens.fonts.serif_display,
        fontSize: 28,
        color: palette.text
      }}>{t('library')}</Text>

      {!loading && cards.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{
            fontFamily: tokens.fonts.serif_italic,
            fontStyle: 'italic',
            fontSize: 14,
            color: palette.text_mute
          }}>{t('library_empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CardListItem card={item} locale={locale} onPress={() => onCardPress?.(item)} />
          )}
        />
      )}
    </View>
  );
}
