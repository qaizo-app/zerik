// SVG-source иконки app, пригоден для генерации PNG любого размера.
// Через `npx expo-asset-converter` или вручную через любой SVG→PNG converter
// можно получить требуемые размеры:
//   - icon.png 1024×1024 (для app.json icon)
//   - adaptive-icon.png 1024×1024 (для Android adaptive)
//   - splash.png 1242×2436 (для splash screen)
//
// Композиция: тёмный круглый фон, по центру — стилизованная "M" из трёх
// вертикальных линий разной длины (метафора "ментальных моделей" + волны
// мышления). Бирюзовый акцент `#5EEAD4` (флагман), фон `#0E1014`.

import Svg, { Defs, LinearGradient, Stop, Circle, Rect, Path, Line } from 'react-native-svg';

export default function AppIconSvg({ size = 1024 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Defs>
        <LinearGradient id="appicon_bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#0E1014" />
          <Stop offset="100%" stopColor="#1D2129" />
        </LinearGradient>
        <LinearGradient id="appicon_accent" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#5EEAD4" />
          <Stop offset="100%" stopColor="#2A9D8F" />
        </LinearGradient>
      </Defs>

      {/* фон — закруглённый квадрат (Android адаптирует сам) */}
      <Rect x="0" y="0" width="1024" height="1024" fill="url(#appicon_bg)" rx="200" ry="200" />

      {/* центральный круг-сцена */}
      <Circle cx="512" cy="512" r="280" fill="none" stroke="#5EEAD4" strokeWidth="6" strokeOpacity="0.25" />
      <Circle cx="512" cy="512" r="200" fill="none" stroke="#5EEAD4" strokeWidth="3" strokeOpacity="0.15" />

      {/* три вертикальных линии — метафора уровней мышления */}
      <Line x1="392" y1="640" x2="392" y2="380" stroke="url(#appicon_accent)" strokeWidth="22" strokeLinecap="round" />
      <Line x1="512" y1="700" x2="512" y2="320" stroke="url(#appicon_accent)" strokeWidth="22" strokeLinecap="round" />
      <Line x1="632" y1="640" x2="632" y2="380" stroke="url(#appicon_accent)" strokeWidth="22" strokeLinecap="round" />

      {/* акцентные точки на верху каждой линии */}
      <Circle cx="392" cy="380" r="14" fill="#5EEAD4" />
      <Circle cx="512" cy="320" r="16" fill="#5EEAD4" />
      <Circle cx="632" cy="380" r="14" fill="#5EEAD4" />
    </Svg>
  );
}
