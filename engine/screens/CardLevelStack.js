// CardLevelStack — вертикальный FlatList уровней глубины одной карточки.
// Каждый level — отдельная "карточка" с тем же category palette, но другим
// контентом (level 2 — деталь/история/научный разбор, level 3 — мета-обсуждение).
//
// Используется внутри ячейки горизонтального CardStackScreen: каждая
// горизонтальная "страница" = вертикальный стек уровней.

import { useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';

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
  const [containerHeight, setContainerHeight] = useState(0);
  const listRef = useRef(null);

  if (!Array.isArray(levels) || levels.length === 0) {
    return <View style={{ width, height: '100%', backgroundColor: palette.bg }} />;
  }

  // Single-level — без FlatList, чтобы не нарушать inner ScrollView CardScreen.
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

  const renderItem = ({ item }) => (
    <View style={{ width, height: containerHeight }}>
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
  );

  const onMomentumScrollEnd = useCallback((e) => {
    if (!containerHeight) return;
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / containerHeight);
    if (idx !== activeLevel) setActiveLevel(idx);
  }, [activeLevel, containerHeight]);

  return (
    <View
      style={{ width, height: '100%' }}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        if (h && h !== containerHeight) setContainerHeight(h);
      }}
    >
      {containerHeight > 0 ? (
        <FlatList
          ref={listRef}
          data={levels}
          keyExtractor={(it) => `level_${it.level}_${it.card.id}`}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={(_, idx) => ({ length: containerHeight, offset: containerHeight * idx, index: idx })}
          style={{ backgroundColor: palette.bg }}
        />
      ) : null}
    </View>
  );
}
