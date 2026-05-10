import { useEffect } from 'react';
import { Image, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const SERIF_REG = 'SourceSerif-Regular';
const SERIF_BLD = 'SourceSerif-Bold';
const SERIF_IT  = 'SourceSerif-Italic';
const MONO      = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const ACCENT     = '#9E9BC4';
const ACCENT_DIM = '#5E5B82';
const TEXT       = '#E8E5F0';
const TEXT_DIM   = '#A8A4C0';
const TEXT_MUTE  = '#6E6A88';
const BORDER     = 'rgba(158, 155, 196, 0.40)';

const ICON_SOURCE = require('../assets/icon.png');

function pad3(n) { return String(n || 0).padStart(3, '0'); }

const LABELS = {
  en: { day: 'DAY', wild: 'IN THE WILD', of: '/' },
  ru: { day: 'ДЕНЬ', wild: 'В ЖИЗНИ', of: '/' },
};

export function CavilCard({ card, locale = 'en', width = 340, height, dayNumber, totalCards = 100, saved = false, onSave }) {
  const loc = card?.i18n?.[locale] || Object.values(card?.i18n || {})[0] || {};
  const HEIGHT = height || width * 1.85;
  const labels = LABELS[locale] || LABELS.en;

  const orderNum  = dayNumber || card?.order || 0;
  const titleCaps = (loc.title || '').toUpperCase();

  async function handleShare() {
    const text = [loc.title, '', loc.body, '', loc.example ? `"${loc.example}"` : ''].filter(Boolean).join('\n');
    try { await Share.share({ message: text }); } catch (e) {}
  }
  function handleSave() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSave?.();
  }

  // Subtle entrance animation: title fades up, then body
  const titleOp = useSharedValue(0);
  const bodyOp  = useSharedValue(0);
  useEffect(() => {
    titleOp.value = 0;
    bodyOp.value  = 0;
    titleOp.value = withDelay(120, withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }));
    bodyOp.value  = withDelay(380, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
  }, [card?.id]);

  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOp.value, transform: [{ translateY: (1 - titleOp.value) * 8 }] }));
  const bodyStyle  = useAnimatedStyle(() => ({ opacity: bodyOp.value }));

  return (
    <View style={[styles.card, { width, height: HEIGHT }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Latin sub-label */}
        {!!card?.latin && (
          <Text style={styles.latin}>{card.latin}</Text>
        )}

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Text
            style={styles.title}
            adjustsFontSizeToFit
            numberOfLines={2}
            minimumFontScale={0.55}
            textBreakStrategy="simple"
            allowFontScaling={false}
          >{loc.title}</Text>
        </Animated.View>

        {/* Body */}
        <Animated.View style={bodyStyle}>
          <Text style={styles.body}>{loc.body}</Text>

          {!!loc.example && (
            <View style={styles.wildBlock}>
              <Text style={styles.wildLabel}>▸ {labels.wild}</Text>
              <View style={styles.wildQuoteWrap}>
                <View style={styles.wildBar} />
                <Text style={styles.wildQuote}>{`"${loc.example}"`}</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Action icons — top-right corner: save + share */}
      <View style={styles.actionIcons}>
        {!!onSave && (
          <Pressable onPress={handleSave} hitSlop={10} style={styles.actionBtn}>
            <Feather name={saved ? 'bookmark' : 'bookmark'} size={18} color={saved ? ACCENT : TEXT_DIM} fill={saved ? ACCENT : 'transparent'} />
          </Pressable>
        )}
        <Pressable onPress={handleShare} hitSlop={10} style={styles.actionBtn}>
          <Feather name="share-2" size={18} color={TEXT_DIM} />
        </Pressable>
      </View>

      {/* Small brand stamp — bottom-right corner, subtle */}
      <Image source={ICON_SOURCE} style={styles.cornerStamp} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 8,
    overflow: 'hidden',
  },

  // META
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  metaLeft: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 1.6,
    color: TEXT_DIM,
    flex: 1,
    marginRight: 12,
  },
  metaRight: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 1.6,
    color: TEXT_MUTE,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 28,
  },

  // LATIN
  latin: {
    fontFamily: SERIF_IT,
    fontSize: 16,
    color: TEXT_DIM,
    marginBottom: 16,
    letterSpacing: 0.2,
  },

  // TITLE
  title: {
    fontFamily: SERIF_BLD,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1,
    color: ACCENT,
    marginBottom: 24,
  },

  // CORNER STAMP — small brand mark, bottom-right
  cornerStamp: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 28,
    height: 28,
    opacity: 0.4,
  },

  // ACTION ICONS — top-right corner (save + share)
  actionIcons: {
    position: 'absolute',
    top: 12,
    right: 16,
    flexDirection: 'row',
    gap: 14,
  },
  actionBtn: {
    padding: 4,
  },

  // BODY
  body: {
    fontFamily: SERIF_REG,
    fontSize: 18,
    lineHeight: 30,
    color: TEXT,
    marginBottom: 8,
  },

  // IN THE WILD
  wildBlock: {
    marginTop: 32,
  },
  wildLabel: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: 1.8,
    color: TEXT_MUTE,
    marginBottom: 14,
  },
  wildQuoteWrap: {
    flexDirection: 'row',
    paddingLeft: 4,
  },
  wildBar: {
    width: 2,
    backgroundColor: ACCENT,
    opacity: 0.6,
    marginRight: 14,
    alignSelf: 'stretch',
  },
  wildQuote: {
    flex: 1,
    fontFamily: SERIF_IT,
    fontSize: 17,
    lineHeight: 28,
    color: TEXT_DIM,
  },
});
