// Хук для получения палитры конкретной категории — независимо от текущего
// глобального theme.category. Полезен для cross-promo превью карточек других
// продуктов линейки в SettingsScreen.

import { useTheme } from './ThemeContext';

export function usePalette(categorySlug) {
  const { palettes, palette: current } = useTheme();
  if (!categorySlug) return current;
  return palettes[categorySlug] || palettes.default || current;
}
