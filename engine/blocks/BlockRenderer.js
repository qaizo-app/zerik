// Рендерит массив блоков из card.i18n[locale].blocks.
// Неизвестные блоки логируются в DEV и пропускаются — это позволяет добавлять
// новые типы блоков в карточки без брейкинга старых билдов клиентов.

import { View } from 'react-native';
import { getBlockComponent } from './registry';
import ErrorBoundary from '../components/ErrorBoundary';

export default function BlockRenderer({ blocks, card, locale, dynamic }) {
  if (!Array.isArray(blocks)) return null;

  return (
    <View>
      {blocks.map((block, i) => {
        const Component = getBlockComponent(block.type);
        if (!Component) {
          if (__DEV__) console.warn(`[BlockRenderer] Unknown block type: ${block.type}`);
          return null;
        }
        return (
          <ErrorBoundary key={`${block.type}-${i}`} fallback={null}>
            <Component
              {...block.props}
              card={card}
              locale={locale}
              dynamic={dynamic}
            />
          </ErrorBoundary>
        );
      })}
    </View>
  );
}
