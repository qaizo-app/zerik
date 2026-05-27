// Editorial Practice screen — заменяет engine HistoryScreen для Cavil.
// Streak, последние 28 дней grid, агрегированная статистика.
//
// Mockup reference: cavil-screen-4 (Practice / Your Progress).

import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pluralizeDays, pluralizeDaysUpper } from '@engine';

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
const BORDER     = 'rgba(158, 155, 196, 0.30)';
const FAINT      = 'rgba(158, 155, 196, 0.14)';

const LABELS = {
  en: {
    eyebrow:    'YOUR PROGRESS',
    title:      'Practice',
    unbrokenSuffix: 'unbroken',          // "{N days} {unbroken}"
    personalBest: 'PERSONAL BEST',
    last28:     'LAST 28 DAYS',
    collected:  'SAVED',
    totalSuffix:'TOTAL',                 // "{N DAYS} {TOTAL}"
    empty:      'No streak yet. Open today\'s card to begin.',
  },
  ru: {
    eyebrow:    'ТВОЙ ПРОГРЕСС',
    title:      'Практика',
    unbrokenSuffix: 'без пропуска',      // "{N дней} {без пропуска}"
    personalBest: 'ЛИЧНЫЙ РЕКОРД',
    last28:     'ПОСЛЕДНИЕ 28 ДНЕЙ',
    collected:  'СОХРАНЕНО',
    totalSuffix:'ВСЕГО',                 // "{N ДНЕЙ} {ВСЕГО}"
    empty:      'Стрик не начат. Открой сегодняшнюю карточку, чтобы стартовать.',
  },
};

function StreakGrid({ streak }) {
  // 28 squares, exactly 2 rows × 14 (no wrapping). Cells flex-fill the row.
  const filled   = Math.min(streak, 28);
  const todayPos = filled > 0 ? filled - 1 : -1;

  const cells = Array.from({ length: 28 }, (_, i) => {
    let style;
    if (i === todayPos) {
      style = { backgroundColor: ACCENT_DIM, borderColor: ACCENT, borderWidth: 1 };
    } else if (i < filled) {
      style = { backgroundColor: ACCENT };
    } else {
      style = { borderColor: TEXT_MUTE, borderWidth: 1, borderStyle: i === filled ? 'dashed' : 'solid', opacity: 0.3 };
    }
    return <View key={i} style={[styles.gridCell, style]} />;
  });

  return (
    <View style={styles.grid}>
      <View style={styles.gridRow}>{cells.slice(0, 14)}</View>
      <View style={styles.gridRow}>{cells.slice(14)}</View>
    </View>
  );
}

export function CavilPractice({ locale = 'en', streak = { current: 0, best: 0 }, openedCount = 0, savedCount = 0 }) {
  const insets = useSafeAreaInsets();
  const labels = LABELS[locale] || LABELS.en;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowLine} />
          <Text style={styles.eyebrow}>{labels.eyebrow}</Text>
        </View>
        <Text style={styles.title}>{labels.title}</Text>
      </View>

      {/* Streak card */}
      <View style={{ paddingHorizontal: 24 }}>
        <View style={styles.streakCard}>
          <Text style={styles.streakNumber}>{streak.current}</Text>
          <Text style={styles.streakLabel}>
            {pluralizeDays(streak.current, locale)} {labels.unbrokenSuffix}
          </Text>
          <View style={styles.streakDivider} />
          <Text style={styles.bestLabel}>
            {labels.personalBest} · {streak.best || streak.current} {pluralizeDaysUpper(streak.best || streak.current, locale)}
          </Text>
        </View>
      </View>

      {/* Last 28 days */}
      <View style={{ paddingHorizontal: 24, marginTop: 36 }}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow}>▸ {labels.last28}</Text>
        </View>
        <StreakGrid streak={streak.current} totalDays={28} />
      </View>

      {/* Stats row — saved + days total (no "to go" so the user isn't reminded
          how many days remain; the framing is "what you've done") */}
      <View style={{
        paddingHorizontal: 24,
        marginTop: 48,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: BORDER,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{savedCount}</Text>
          <Text style={styles.statLabel}>{labels.collected}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{openedCount}</Text>
          <Text style={styles.statLabel}>{pluralizeDaysUpper(openedCount, locale)} {labels.totalSuffix}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  eyebrowLine: { height: 1, width: 28, backgroundColor: ACCENT_DIM },
  eyebrow: {
    fontFamily: MONO, fontSize: 11, letterSpacing: 1.8, color: TEXT_DIM, textTransform: 'uppercase',
  },
  title: {
    fontFamily: SERIF_BLD, fontSize: 44, lineHeight: 50, letterSpacing: -1.2, color: ACCENT,
  },

  // Streak card
  streakCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  streakNumber: {
    fontFamily: SERIF_BLD, fontSize: 96, lineHeight: 100, letterSpacing: -3, color: ACCENT,
  },
  streakLabel: {
    fontFamily: SERIF_IT, fontSize: 16, color: TEXT_DIM, marginTop: 4,
  },
  streakDivider: {
    height: 1, backgroundColor: BORDER, alignSelf: 'stretch', marginTop: 22, marginBottom: 16,
  },
  bestLabel: {
    fontFamily: MONO, fontSize: 11, letterSpacing: 1.6, color: TEXT_MUTE,
  },

  // Grid — 2 explicit rows × 14, cells flex-fill the row
  grid: {
    marginTop: 16,
    gap: 6,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 5,
  },
  gridCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 2,
  },

  // Stats
  stat: { alignItems: 'flex-start' },
  statNumber: {
    fontFamily: SERIF_BLD, fontSize: 32, color: ACCENT, letterSpacing: -1,
  },
  statLabel: {
    fontFamily: MONO, fontSize: 10, letterSpacing: 1.6, color: TEXT_MUTE, marginTop: 4,
  },
});
