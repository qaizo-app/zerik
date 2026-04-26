// CardLevelStack — вертикальный FlatList уровней глубины одной карточки.
// Каждый level — отдельная "карточка" с тем же category palette, но другим
// контентом (level 2 — деталь/история/научный разбор, level 3 — мета-обсуждение).
//
// Используется внутри ячейки горизонтального CardStackScreen: каждая
// горизонтальная "страница" = вертикальный стек уровней.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CardLevelStack({
  levels,            // [{ level: 1, card: rootCard }, { level: 2, card: deepCard }, ...]
  width,             // должен совпадать с шириной горизонтальной ячейки
  locale = 'ru',
  dynamic,
  isSaved,
  onSave,
  onShare
}) {
  const { palette } = useTheme();
  const [activeLevel, setActiveLevel] = useState(0);
  const listRef = useRef(null);

  if (!Array.isArray(levels) || levels.length === 0) {
    return <View style={{ width, height: '100%', backgroundColor: palette.bg }} />;
  }

  const stackHeight = SCREEN_HEIGHT;

  const renderItem = useCallback(({ item }) => (
    <View style={{ width, height: stackHeight }}>
      <ErrorBoundary>
        <CardScreen
          card={item.card}
          locale={locale}
          dynamic={dynamic}
          isSaved={isSaved}
          onSave={onSave}
          onShare={onShare}
        />
      </ErrorBoundary>
    </View>
  ), [width, stackHeight, locale, dynamic, isSaved, onSave, onShare]);

  const onMomentumScrollEnd = useCallback((e) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / stackHeight);
    if (idx !== activeLevel) setActiveLevel(idx);
  }, [activeLevel, stackHeight]);

  // Если уровень один — рендерим без FlatList (быстрее, не теряет ScrollView внутри).
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

  return (
    <FlatList
      ref={listRef}
      data={levels}
      keyExtractor={(it) => `level_${it.level}_${it.card.id}`}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      getItemLayout={(_, idx) => ({ length: stackHeight, offset: stackHeight * idx, index: idx })}
      style={{ backgroundColor: palette.bg }}
    />
  );
}
