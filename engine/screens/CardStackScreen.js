// CardStackScreen — горизонтальный FlatList цепочки карточек с pagingEnabled.
// Каждая страница = одна карточка (CardScreen). Палитра переключается на
// onScroll (когда новая карточка занимает >50% экрана) — без визуальной задержки
// «старая палитра на новой карточке».

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
  onCardOpened,
  savedIds,
  onSavePress,
  onSharePress
}) {
  const { palette, setCategory } = useTheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const listRef = useRef(null);

  // Уведомить о том что карточка открыта (для streak/recordCardOpened).
  // А также синхронизируем глобальную category с активной карточкой —
  // полезно для NavigationContainer и UI вне карточки. Палитра самих карточек
  // от глобального category НЕ зависит (CardScreen оборачивает себя в
  // CardThemeScope), так что коллизий со старой палитрой при свайпе нет.
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
      <CardScreen
        card={item}
        locale={locale}
        dynamic={dynamic}
        isSaved={Array.isArray(savedIds) && savedIds.includes(item.id)}
        onSave={() => onSavePress?.(item)}
        onShare={() => onSharePress?.(item)}
      />
    </View>
  ), [locale, dynamic, savedIds, onSavePress, onSharePress]);

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
