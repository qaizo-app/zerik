import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getIllustrationFor } from '../illustrations';

const SURFACE      = '#0F1E30';
const SURFACE_BACK = '#122030';
const ACCENT       = '#F5A623';
const TEXT         = '#F5F8FF';
const TEXT_SEC     = '#B0C8DF';
const BORDER       = '#1E3348';

export function BiasCard({ card, locale = 'en', width = 340, height, dayNumber, onFlipped, onSave, saved }) {
  const flip       = useSharedValue(0);
  const scale      = useSharedValue(1);
  const barOpacity = useSharedValue(0.7);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    barOpacity.value = withDelay(900, withSequence(
      withTiming(0.12, { duration: 550 }),
      withTiming(0.7,  { duration: 380 }),
      withDelay(160, withTiming(0.12, { duration: 550 })),
      withTiming(0.7,  { duration: 380 }),
    ));
  }, []);

  const loc          = card?.i18n?.[locale] || Object.values(card?.i18n || {})[0] || {};
  const HEIGHT       = height || width * 1.62;
  const Illustration = getIllustrationFor(card?.id);

  function handlePressIn() {
    scale.value = withSpring(0.972, { damping: 18, stiffness: 300 });
  }
  function handlePressOut() {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  }
  function handlePress() {
    if (shown) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flip.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
    setShown(true);
    onFlipped?.();
  }
  async function handleShare() {
    const text = [loc.title, '', loc.body, '', loc.tip].filter(Boolean).join('\n');
    try { await Share.share({ message: text }); } catch (e) {}
  }

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const barStyle       = useAnimatedStyle(() => ({ opacity: barOpacity.value }));
  const frontStyle     = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` }],
    opacity: flip.value < 0.5 ? 1 : 0,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1400 }, { rotateY: `${interpolate(flip.value, [0, 1], [-180, 0])}deg` }],
    opacity: flip.value >= 0.5 ? 1 : 0,
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width, height: HEIGHT }}
      disabled={shown}
    >
      <Animated.View style={[{ width, height: HEIGHT }, containerStyle]}>

        {/* FRONT */}
        <Animated.View style={[styles.card, { width, height: HEIGHT, backgroundColor: SURFACE }, frontStyle]}>
          {!!dayNumber && (
            <Text style={styles.dayNumber}>{String(dayNumber).padStart(2, '0')}</Text>
          )}
          <View style={styles.amberMark} />
          <View style={{ flex: 1, justifyContent: 'center', paddingBottom: 16 }}>
            <Text style={styles.title}>{loc.title}</Text>
            <View style={styles.hairline} />
            <Text style={styles.hook}>{loc.hook}</Text>
          </View>
          <Animated.View style={[styles.revealBar, barStyle]} />
        </Animated.View>

        {/* BACK */}
        <Animated.View style={[styles.card, { width, height: HEIGHT, backgroundColor: SURFACE_BACK, position: 'absolute', top: 0, left: 0 }, backStyle]}>
          <Text style={styles.backLabel}>{loc.title}</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 8 }}>
            {Illustration ? (
              <View style={styles.illustration}>
                <Illustration width="100%" height={150} />
              </View>
            ) : null}
            <Text style={styles.body}>{loc.body}</Text>
            {!!loc.example && (
              <View style={styles.quoteBlock}>
                <Text style={styles.quoteMark}>"</Text>
                <Text style={styles.quoteText}>{loc.example}</Text>
              </View>
            )}
            {!!loc.tip && (
              <Text style={styles.tip}>{loc.tip}</Text>
            )}
          </ScrollView>

          {/* Action row */}
          <View style={styles.actionRow}>
            {!!onSave && (
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSave?.(); }} style={[styles.actionBtn, saved && styles.actionBtnActive]}>
                <Feather name="bookmark" size={20} color={saved ? ACCENT : TEXT_SEC} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <Feather name="share" size={20} color={TEXT_SEC} />
            </TouchableOpacity>
          </View>
        </Animated.View>

      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 0,
    overflow: 'hidden',
  },

  // FRONT
  dayNumber: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontFamily: 'Inter-Bold',
    fontSize: 88,
    lineHeight: 88,
    color: TEXT,
    opacity: 0.04,
    letterSpacing: -4,
  },
  amberMark: {
    width: 8,
    height: 8,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
    color: ACCENT,
    marginBottom: 20,
  },
  hairline: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 20,
  },
  hook: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: -0.1,
    color: TEXT_SEC,
    fontStyle: 'italic',
  },
  revealBar: {
    height: 3,
    backgroundColor: ACCENT,
    marginHorizontal: -28,
    marginTop: 24,
  },

  // BACK
  backLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  illustration: {
    marginHorizontal: -28,
    marginBottom: 22,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: -0.1,
    color: TEXT,
    marginBottom: 22,
  },
  quoteBlock: {
    marginBottom: 18,
    paddingLeft: 4,
  },
  quoteMark: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 28,
    color: ACCENT,
    opacity: 0.5,
    marginBottom: 4,
  },
  quoteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 23,
    color: TEXT_SEC,
    letterSpacing: -0.1,
  },
  tip: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 22,
    color: ACCENT,
    letterSpacing: -0.1,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginHorizontal: -28,
    paddingHorizontal: 20,
  },
  actionBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(245,166,35,0.12)',
  },
});
