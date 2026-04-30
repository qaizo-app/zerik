import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const SURFACE      = '#111D2B';
const SURFACE_BACK = '#162030';
const ACCENT       = '#E89647';
const TEXT         = '#F0F4F8';
const TEXT_SEC     = '#7A95B0';
const BORDER       = '#1C2F42';
const BG           = '#0D1B2A';

export function BiasCard({ card, locale = 'en', width = 340, dayNumber, onFlipped }) {
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

  const loc = card?.i18n?.[locale] || Object.values(card?.i18n || {})[0] || {};
  const HEIGHT = width * 1.48;

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

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({ opacity: barOpacity.value }));

  const frontStyle = useAnimatedStyle(() => ({
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
    >
      <Animated.View style={[{ width, height: HEIGHT }, containerStyle]}>

        {/* FRONT */}
        <Animated.View style={[styles.card, { width, height: HEIGHT, backgroundColor: SURFACE }, frontStyle]}>

          {/* Day number — faded background element */}
          {!!dayNumber && (
            <Text style={styles.dayNumber}>{String(dayNumber).padStart(2, '0')}</Text>
          )}

          {/* Amber mark */}
          <View style={styles.amberMark} />

          <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 28 }}>
            <Text style={styles.title}>{loc.title}</Text>
            <View style={styles.hairline} />
            <Text style={styles.hook}>{loc.hook}</Text>
          </View>

          <Animated.View style={[styles.revealBar, barStyle]} />
        </Animated.View>

        {/* BACK */}
        <Animated.View style={[styles.card, { width, height: HEIGHT, backgroundColor: SURFACE_BACK, position: 'absolute', top: 0, left: 0 }, backStyle]}>
          <Text style={styles.backLabel}>{loc.title}</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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

          <View style={styles.doneBar} />
        </Animated.View>

      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
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
    right: 20,
    top: 16,
    fontFamily: 'Inter-Bold',
    fontSize: 80,
    lineHeight: 80,
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
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: TEXT,
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
    opacity: 0.7,
    marginTop: 24,
  },

  // BACK
  backLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    letterSpacing: 2.4,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: -0.1,
    color: TEXT,
    marginBottom: 24,
  },
  quoteBlock: {
    marginBottom: 20,
    paddingLeft: 4,
  },
  quoteMark: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 28,
    color: ACCENT,
    opacity: 0.6,
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
    fontSize: 13,
    lineHeight: 21,
    color: ACCENT,
    letterSpacing: -0.1,
    opacity: 0.85,
    marginBottom: 24,
  },
  doneBar: {
    height: 3,
    width: 32,
    backgroundColor: ACCENT,
    marginLeft: -28,
    opacity: 0.5,
    marginBottom: 20,
  },
});
