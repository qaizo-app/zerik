// Editorial Fallacies index — заменяет engine LibraryScreen для Cavil.
// Показывает все карточки Vol. I со статусом: COLLECTED / TODAY / TOMORROW / locked.
//
// Mockup reference: cavil-screen-3 (Fallacies index list).

import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SERIF_REG = 'SourceSerif-Regular';
const SERIF_BLD = 'SourceSerif-Bold';
const SERIF_IT  = 'SourceSerif-Italic';
const MONO      = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const BG         = '#161420';
const ACCENT     = '#9E9BC4';
const ACCENT_DIM = '#5E5B82';
const TEXT       = '#E8E5F0';
const TEXT_DIM   = '#A8A4C0';
const TEXT_MUTE  = '#6E6A88';
const BORDER     = 'rgba(158, 155, 196, 0.18)';

function pad3(n) { return String(n || 0).padStart(3, '0'); }

const LABELS = {
  en: { eyebrow: 'LIBRARY · INDEX', title: 'Fallacies', of: 'of', collected: 'collected', vol: 'vol. i', today: 'TODAY', tomorrow: 'TOMORROW', collectedTag: 'COLLECTED', locked: '— locked —' },
  ru: { eyebrow: 'БИБЛИОТЕКА · УКАЗАТЕЛЬ', title: 'Уловки', of: 'из', collected: 'собрано', vol: 'том i', today: 'СЕГОДНЯ', tomorrow: 'ЗАВТРА', collectedTag: 'СОБРАНО', locked: '— заперто —' },
};

function StatusDot({ state }) {
  // state: 'collected' | 'today' | 'past' | 'locked'
  if (state === 'today') {
    return (
      <View style={[styles.dot, { backgroundColor: ACCENT, borderColor: ACCENT }]}>
        <Text style={styles.dotC}>C</Text>
      </View>
    );
  }
  if (state === 'collected') {
    return (
      <View style={[styles.dot, { backgroundColor: ACCENT, borderColor: ACCENT, opacity: 0.95 }]}>
        <Text style={styles.dotC}>C</Text>
      </View>
    );
  }
  if (state === 'past') {
    return (
      <View style={[styles.dot, { borderColor: TEXT_MUTE, borderWidth: 1 }]} />
    );
  }
  // locked
  return (
    <View style={[styles.dot, { borderColor: TEXT_MUTE, borderStyle: 'dashed', borderWidth: 1 }]} />
  );
}

function FallacyRow({ card, locale, state, onPress, label, isLocked }) {
  const loc = card?.i18n?.[locale] || Object.values(card?.i18n || {})[0] || {};
  const titleColor = isLocked ? TEXT_MUTE : (state === 'today' ? ACCENT : TEXT);
  const subColor   = isLocked ? TEXT_MUTE : TEXT_DIM;

  const labelColor =
    state === 'today'     ? ACCENT     :
    state === 'collected' ? ACCENT     :
    state === 'tomorrow'  ? TEXT_MUTE  :
                            TEXT_MUTE;

  return (
    <Pressable
      onPress={isLocked ? undefined : onPress}
      style={({ pressed }) => [styles.row, pressed && !isLocked && { opacity: 0.7 }]}
    >
      <Text style={styles.rowNumber}>№ {pad3(card.order)}</Text>
      <View style={{ marginRight: 16 }}>
        <StatusDot state={state} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: titleColor }]} numberOfLines={1}>
          {loc.title || card.id}
        </Text>
        {card.latin ? (
          <Text style={[styles.rowLatin, { color: subColor }]} numberOfLines={1}>
            {card.latin}
          </Text>
        ) : isLocked ? (
          <Text style={[styles.rowLatin, { color: TEXT_MUTE, fontStyle: 'normal', fontFamily: MONO, fontSize: 10, letterSpacing: 1.4 }]}>
            {label || ''}
          </Text>
        ) : null}
      </View>
      {label ? (
        <Text style={[styles.rowLabel, { color: labelColor }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

export function CavilLibrary({ locale = 'en', allCards = [], todayIndex, savedIds = [], totalVolume = 100, onCardPress }) {
  const insets = useSafeAreaInsets();
  const labels = LABELS[locale] || LABELS.en;

  const collectedCount = savedIds.length;
  const cards = [...allCards].sort((a, b) => (a.order || 0) - (b.order || 0));

  function stateFor(card) {
    const o = card.order;
    if (o === todayIndex) return 'today';
    if (o === todayIndex + 1) return 'tomorrow';
    if (o > todayIndex)   return 'locked';
    if (savedIds.includes(card.id)) return 'collected';
    return 'past';
  }

  function labelFor(state) {
    switch (state) {
      case 'today':     return '▸ ' + labels.today;
      case 'tomorrow':  return labels.tomorrow;
      case 'collected': return '★ ' + labels.collectedTag;
      case 'locked':    return '— —';
      default:          return '';
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 24, marginBottom: 18 }}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrow}>{labels.eyebrow}</Text>
        </View>
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>
          {collectedCount} {labels.of} {totalVolume} {labels.collected} · {labels.vol}
        </Text>
      </View>

      {/* List */}
      <View style={{ paddingHorizontal: 24, marginTop: 24 }}>
        {cards.map((card, i) => {
          const s = stateFor(card);
          const isLocked = s === 'locked' || s === 'tomorrow';
          return (
            <View key={card.id || i}>
              <FallacyRow
                card={card}
                locale={locale}
                state={s}
                isLocked={isLocked}
                label={labelFor(s)}
                onPress={() => onCardPress?.(card)}
              />
              {i < cards.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  eyebrowLine: { height: 1, width: 28, backgroundColor: ACCENT_DIM },
  eyebrow: {
    fontFamily: MONO, fontSize: 11, letterSpacing: 1.8, color: TEXT_DIM, textTransform: 'uppercase',
  },
  title: {
    fontFamily: SERIF_BLD, fontSize: 44, lineHeight: 50, letterSpacing: -1.2, color: ACCENT, marginBottom: 8,
  },
  subtitle: {
    fontFamily: SERIF_IT, fontSize: 16, color: TEXT_DIM,
  },

  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
  },
  rowNumber: {
    fontFamily: MONO, fontSize: 11, letterSpacing: 1.4, color: TEXT_MUTE, width: 56,
  },
  rowTitle: {
    fontFamily: SERIF_BLD, fontSize: 22, letterSpacing: -0.4, marginBottom: 2,
  },
  rowLatin: {
    fontFamily: SERIF_IT, fontSize: 14, letterSpacing: 0.1,
  },
  rowLabel: {
    fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, marginLeft: 12,
  },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 0 },

  dot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 0,
  },
  dotC: {
    fontFamily: SERIF_BLD, fontSize: 13, color: BG,
  },
});
