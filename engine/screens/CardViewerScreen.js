// CardViewerScreen — modal-обёртка над CardScreen для просмотра отдельной
// сохранённой/исторической карточки. Не имеет swipe между карточками — только
// один экран + кнопка назад. Используется когда пользователь тапает в Library
// или History на конкретную карточку.

import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import progressService from '../core/progressService';
import shareService from '../core/shareService';

export default function CardViewerScreen({ route, navigation, contentService, locale = 'ru', resolveLevels }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState([]);

  const cardId = route?.params?.cardId;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cardId) { setLoading(false); return; }
      try {
        const [c, ids] = await Promise.all([
          contentService.getCardById(cardId),
          progressService.getSavedIds()
        ]);
        if (!cancelled) { setCard(c); setSavedIds(ids || []); setLoading(false); }
      } catch (e) {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [cardId, contentService]);

  async function handleSave() {
    if (!card) return;
    const next = await progressService.toggleSaved(card.id);
    setSavedIds(next?.saved_card_ids || []);
  }

  async function handleShare() {
    if (!card) return;
    await shareService.shareCard(null, {
      card,
      locale,
      fallbackUrl: `https://zerik.app/cards/${card.id}`
    }).catch(() => {});
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={palette.accent} size="large" />
      </View>
    );
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

  const isSaved = savedIds.includes(card.id);

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ErrorBoundary>
        <CardScreen
          card={card}
          locale={locale}
          isSaved={isSaved}
          onSave={handleSave}
          onShare={handleShare}
        />
      </ErrorBoundary>
      {/* Floating × — поверх контента, ниже topbar чтобы не перекрывать 🔥 streak */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: insets.top + 56,
          right: 16,
          zIndex: 10,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: palette.bg_card,
          borderWidth: 1,
          borderColor: palette.border_bright,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        hitSlop={10}
      >
        <Text style={{
          color: palette.accent,
          fontFamily: tokens.fonts.mono_medium,
          fontSize: 18,
          lineHeight: 18,
          marginTop: -1
        }}>×</Text>
      </Pressable>
    </View>
  );
}
