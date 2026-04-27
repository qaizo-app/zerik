// CardLevelStack — вертикальный стек уровней одной карточки.
// Single ScrollView, контент течёт непрерывно: level 1 → level 2 → ...
// Без paging-снапа — простой continuous scroll. Это устраняет конфликт
// вложенных вертикальных скроллов (раньше FlatList застревал посередине)
// и даёт более естественный reading flow.
//
// Когда levels.length > 1, CardScreen рендерится с noScroll=true: верхний
// ScrollView сам управляет скроллом, нижний CardScreen просто рендерит
// контент в плоский View.

import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';

function LevelDivider({ level }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      paddingVertical: 36,
      paddingHorizontal: 24,
      alignItems: 'center',
      backgroundColor: palette.bg
    }}>
      <View style={{ width: 32, height: 2, backgroundColor: palette.accent, marginBottom: 16, opacity: 0.6 }} />
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 10,
        letterSpacing: 2.5,
        color: palette.accent,
        textTransform: 'uppercase',
        marginBottom: 6
      }}>
        ↓ {t('level_label')} {level}
      </Text>
      <Text style={{
        fontFamily: tokens.fonts.serif_italic,
        fontStyle: 'italic',
        fontSize: 12,
        color: palette.text_mute,
        textAlign: 'center'
      }}>
        {t('level_intro')}
      </Text>
    </View>
  );
}

export default function CardLevelStack({
  levels,
  width,
  locale = 'ru',
  dynamic,
  isSaved,
  onSave,
  onShare
}) {
  const { palette } = useTheme();

  if (!Array.isArray(levels) || levels.length === 0) {
    return <View style={{ width, height: '100%', backgroundColor: palette.bg }} />;
  }

  // Single-level — CardScreen со своим ScrollView (быстрее).
  if (levels.length === 1) {
    return (
      <View style={{ width, height: '100%' }}>
        <ErrorBoundary>
          <CardScreen
            card={levels[0].card}
            locale={locale}
            dynamic={dynamic}
            isSaved={isSaved}
            onSave={onSave}
            onShare={onShare}
          />
        </ErrorBoundary>
      </View>
    );
  }

  // Multi-level — единый ScrollView, контент уровней друг за другом.
  return (
    <ScrollView
      style={{ width, flex: 1, backgroundColor: palette.bg }}
      showsVerticalScrollIndicator={false}
    >
      {levels.map((item, idx) => (
        <View key={`level_${item.level}_${item.card.id}`}>
          {idx > 0 ? <LevelDivider level={item.level} /> : null}
          <ErrorBoundary>
            <CardScreen
              card={item.card}
              locale={locale}
              dynamic={dynamic}
              isSaved={isSaved}
              onSave={onSave}
              onShare={onShare}
              noScroll
            />
          </ErrorBoundary>
        </View>
      ))}
    </ScrollView>
  );
}
