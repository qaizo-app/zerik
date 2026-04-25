// CardStackScreen — горизонтальный FlatList цепочки карточек с pagingEnabled.
// Каждая страница = одна карточка (CardScreen). При смене страницы:
//   - меняется category palette (через setCategory в ThemeContext)
//   - вызывается onCardOpened(cardId)
//
// Уровни глубины (вертикальный свайп) — сейчас не реализованы; CardScreen
// рендерит весь контент уровня 1 в одном ScrollView. Уровни 2-3 добавим
// когда движок будет уверенно работать на одном уровне.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CardScreen from './CardScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CardStackScreen({
  cards,
  initialIndex = 0,
  locale = 'ru',
  dynamic,
  onCardOpened
}) {
  const { palette, setCategory } = useTheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const listRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(cards) || cards.length === 0) return;
    const card = cards[activeIndex];
    if (!card) return;
    if (card.category) setCategory(card.category);
    if (typeof onCardOpened === 'function') onCardOpened(card.id);
  }, [activeIndex, cards, setCategory, onCardOpened]);

  const onMomentumScrollEnd = useCallback((e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_WIDTH);
    if (idx !== activeIndex) setActiveIndex(idx);
  }, [activeIndex]);

  const renderItem = useCallback(({ item }) => (
    <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
      <CardScreen card={item} locale={locale} dynamic={dynamic} />
    </View>
  ), [locale, dynamic]);

  if (!Array.isArray(cards) || cards.length === 0) {
    return <View style={{ flex: 1, backgroundColor: palette.bg }} />;
  }

  return (
    <FlatList
      ref={listRef}
      data={cards}
      keyExtractor={(c) => c.id}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={initialIndex}
      getItemLayout={(_, idx) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * idx, index: idx })}
      onMomentumScrollEnd={onMomentumScrollEnd}
      style={{ backgroundColor: palette.bg }}
    />
  );
}
