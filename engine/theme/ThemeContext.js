// ThemeContext — управляет двумя осями:
// 1) категория (глобальная — для NavigationContainer и cross-card UI)
// 2) бренд приложения
//
// Внутри карточки используется CardThemeScope — nested Provider, который
// форсит палитру на card.category. Это критично для swipe-навигации:
// в момент перехода на экране одновременно две карточки, у каждой должна
// быть СВОЯ палитра, а не одна общая.

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import tokens from './tokens';

const ThemeContext = createContext({
  palette:    null,
  category:   'mental_models',
  setCategory: () => {},
  tokens,
  brand:      null,
  palettes:   {}
});

export default ThemeContext;

export function ThemeProvider({ categoryPalettes, brand, defaultCategory, children }) {
  const initial = defaultCategory || brand?.primaryCategory || 'mental_models';
  const [category, setCategoryState] = useState(initial);

  const setCategory = useCallback((slug) => {
    if (categoryPalettes[slug]) setCategoryState(slug);
  }, [categoryPalettes]);

  const palette = categoryPalettes[category] || categoryPalettes.default;

  const value = useMemo(() => ({
    palette,
    category,
    setCategory,
    tokens,
    brand,
    palettes: categoryPalettes
  }), [palette, category, setCategory, brand, categoryPalettes]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

// CardThemeScope — оборачивает контент карточки и форсит палитру на её категорию.
// Используется внутри CardScreen чтобы у каждой карточки в swipe-стеке была своя
// независимая палитра.

export function CardThemeScope({ category, children }) {
  const parent = useContext(ThemeContext);
  const palette = (category && parent.palettes[category]) || parent.palette;

  const value = useMemo(() => ({
    ...parent,
    palette,
    category: category || parent.category
  }), [parent, palette, category]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
