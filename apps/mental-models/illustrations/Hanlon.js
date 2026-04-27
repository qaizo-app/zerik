// Hanlon — два пути к одному узлу: "злой умысел" (сложный, с шипами) и
// "глупость" (простая прямая линия). Бритва выбирает простой.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function Hanlon({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="hn_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#hn_grain)" />

      {/* левая точка (наблюдатель) */}
      <Circle cx="60" cy="90" r="5" fill={textMute} />

      {/* правая точка (результат) */}
      <Circle cx="340" cy="90" r="5" fill={textMute} />

      {/* верхний путь — "злой умысел": кривой, с зубцами/петлями */}
      <Path
        d="M 60 90 Q 100 30 150 35 Q 200 40 220 60 Q 240 25 280 35 Q 320 45 340 90"
        fill="none" stroke={textMute} strokeWidth={1.2} opacity={0.5}
      />
      {/* зубцы вдоль верхнего пути */}
      <Path d="M 130 38 L 132 32 L 134 38" fill="none" stroke={textMute} strokeWidth={0.8} opacity={0.5} />
      <Path d="M 200 50 L 202 44 L 204 50" fill="none" stroke={textMute} strokeWidth={0.8} opacity={0.5} />
      <Path d="M 270 40 L 272 34 L 274 40" fill="none" stroke={textMute} strokeWidth={0.8} opacity={0.5} />

      {/* нижний путь — "глупость": прямой и простой */}
      <Path d="M 60 90 L 340 90" fill="none" stroke={accent} strokeWidth={2.5} />

      {/* "бритва" — диагональная линия отсекает верхний путь */}
      <Line x1="100" y1="180" x2="320" y2="0" stroke={accent} strokeWidth={1} strokeDasharray="6,4" opacity={0.7} />
    </Svg>
  );
}
