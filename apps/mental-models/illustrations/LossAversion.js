// LossAversion — асимметричная кривая полезности (Канеман-Тверски).
// Потеря "тяжелее" приобретения той же величины.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function LossAversion({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="la_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#la_grain)" />

      {/* оси координат */}
      <Line x1="200" y1="20"  x2="200" y2="160" stroke={textMute} strokeWidth={0.8} />
      <Line x1="40"  y1="90"  x2="360" y2="90"  stroke={textMute} strokeWidth={0.8} />

      {/* стрелки осей */}
      <Path d="M 196 28 L 200 20 L 204 28" fill="none" stroke={textMute} strokeWidth={0.8} strokeLinecap="round" />
      <Path d="M 352 86 L 360 90 L 352 94" fill="none" stroke={textMute} strokeWidth={0.8} strokeLinecap="round" />

      {/* кривая полезности — вогнутая для приобретений (правая часть)
          и крутая выпуклая для потерь (левая часть). Левая ветвь длиннее по высоте. */}
      <Path
        d="M 60 150 Q 130 145 195 96 Q 200 92 200 90"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />
      <Path
        d="M 200 90 Q 230 78 290 65 Q 330 60 350 56"
        fill="none" stroke={accentDim} strokeWidth={2.5} strokeLinecap="round"
      />

      {/* точки эквивалентной величины — gain и loss */}
      <Line x1="100" y1="90" x2="100" y2="139" stroke={accent} strokeWidth={1} strokeDasharray="2,3" />
      <Circle cx="100" cy="139" r="3" fill={accent} />
      <Line x1="300" y1="90" x2="300" y2="62"  stroke={accentDim} strokeWidth={1} strokeDasharray="2,3" />
      <Circle cx="300" cy="62" r="3" fill={accentDim} />

      {/* симметричное расстояние от оси Y */}
      <Line x1="100" y1="90" x2="100" y2="84" stroke={textMute} strokeWidth={0.5} />
      <Line x1="300" y1="90" x2="300" y2="96" stroke={textMute} strokeWidth={0.5} />
    </Svg>
  );
}
