// ThemeContext — управляет двумя осями:
// 1) категория текущей карточки → акцентная палитра
// 2) бренд приложения → имена/логотипы (через brand.config.js)
//
// Палитры приходят как prop categoryPalettes от приложения. Это позволяет
// одному и тому же движку обслуживать разные продукты линейки без правки кода.

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
