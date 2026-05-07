// Маппинг card.id → SVG-компонент. Иллюстрации добавляются батчем после
// первого dev-билда. Пока пустой registry — карточки рендерятся без визуала.

const ILLUSTRATIONS = {};

export function getIllustrationFor(cardId) {
  return ILLUSTRATIONS[cardId] || null;
}
