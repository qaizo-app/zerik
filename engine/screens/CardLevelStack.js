// CardLevelStack — навигация между уровнями глубины одной карточки.
// Variant A: opt-in — пользователь явно нажимает "↓ Глубже" чтобы открыть
// level 2. Без неявного скролла-перехода. Это более естественно для daily-
// ритуала "одна модель в день": хочешь короткий — закрыл, хочешь глубже —
// явно тапнул.

import { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';
import CardScreen from './CardScreen';
import ErrorBoundary from '../components/ErrorBoundary';

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
  const [activeIdx, setActiveIdx] = useState(0);

  if (!Array.isArray(levels) || levels.length === 0) {
    return <View style={{ width, height: '100%', backgroundColor: palette.bg }} />;
  }

  const current = levels[Math.min(activeIdx, levels.length - 1)];
  const hasDeeper = activeIdx < levels.length - 1;
  const hasParent = activeIdx > 0;
  const nextDeep  = hasDeeper ? levels[activeIdx + 1] : null;
  const deeperType = nextDeep?.card?.deep?.type || null;

  return (
    <View style={{ width, height: '100%' }}>
      <ErrorBoundary key={`lvl_${activeIdx}_${current.card.id}`}>
        <CardScreen
          card={current.card}
          locale={locale}
          dynamic={dynamic}
          isSaved={isSaved}
          onSave={onSave}
          onShare={onShare}
          onContinueDeeper={hasDeeper ? () => setActiveIdx(activeIdx + 1) : null}
          onBackToParent={hasParent ? () => setActiveIdx(activeIdx - 1) : null}
          levelLabel={hasParent ? `${t('level_label')} ${current.level}` : null}
          deeperType={deeperType}
        />
      </ErrorBoundary>
    </View>
  );
}
