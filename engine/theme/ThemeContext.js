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
// независимая палитра. cardId сдвигает HUE акцента ±30° чтобы карточки одной
// категории отличались по оттенку (детерминированно по id).

function shiftHue(hex, deg) {
  const m = hex && hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  h = (h + deg + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const mm = l - c / 2;
  let R = 0, G = 0, B = 0;
  if (h < 60)        { R = c; G = x; }
  else if (h < 120)  { R = x; G = c; }
  else if (h < 180)  { G = c; B = x; }
  else if (h < 240)  { G = x; B = c; }
  else if (h < 300)  { R = x; B = c; }
  else               { R = c; B = x; }
  const toHex = (v) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
  return '#' + toHex(R) + toHex(G) + toHex(B);
}

function hashCardId(id) {
  if (!id) return 0;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return h;
}

export function CardThemeScope({ category, cardId, children }) {
  const parent = useContext(ThemeContext);
  const basePalette = (category && parent.palettes[category]) || parent.palette;

  const palette = useMemo(() => {
    if (!cardId || !basePalette) return basePalette;
    const shift = (Math.abs(hashCardId(cardId)) % 61) - 30;
    return {
      ...basePalette,
      accent:     shiftHue(basePalette.accent,     shift),
      accent_dim: shiftHue(basePalette.accent_dim, shift),
      wiser:      shiftHue(basePalette.wiser,      shift)
    };
  }, [basePalette, cardId]);

  const value = useMemo(() => ({
    ...parent,
    palette,
    category: category || parent.category
  }), [parent, palette, category]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
