// CardViewerScreen — modal-обёртка над CardScreen для просмотра отдельной
// сохранённой/исторической карточки. Не имеет swipe между карточками — только
// один экран + кнопка назад. Используется когда пользователь тапает в Library
// или History на конкретную карточку.

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';

export default function CardViewerScreen({ route, navigation, contentService, locale = 'ru', resolveLevels }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const cardId = route?.params?.cardId;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cardId) { setLoading(false); return; }
      try {
        const c = await contentService.getCardById(cardId);
        if (!cancelled) { setCard(c); setLoading(false); }
      } catch (e) {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [cardId, contentService]);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: palette.bg }} />;
  }

  if (!card) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: palette.text_mute, fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic' }}>
          {t('not_found')}
        </Text>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 16, padding: 12 }}>
          <Text style={{ color: palette.accent, fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' }}>
            {t('back')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      {/* Header-бар: своё пространство для × выше topbar карточки */}
      <View style={{
        paddingTop: insets.top + 8,
        paddingBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: palette.bg
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: palette.bg_card,
            borderWidth: 1,
            borderColor: palette.border_bright,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          hitSlop={8}
        >
          <Text style={{
            color: palette.accent,
            fontFamily: tokens.fonts.mono_medium,
            fontSize: 22,
            lineHeight: 22,
            marginTop: -2
          }}>×</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1 }}>
        <ErrorBoundary>
          <CardScreen card={card} locale={locale} noTopInset />
        </ErrorBoundary>
      </View>
    </View>
  );
}
