// Hindsight — туман до события и прямая ясная стрелка после.
// Метафора: до — много возможных путей, после — выглядит будто была прямая дорога.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function Hindsight({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="hi_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#hi_grain)" />

      {/* левая зона — туман: облачные кривые-возможные пути */}
      <Path d="M 40 90 Q 80 60 120 90 T 200 110" stroke={textMute} strokeWidth={1.2} fill="none" strokeDasharray="3,4" opacity={0.6} />
      <Path d="M 40 110 Q 90 130 140 100 T 200 110" stroke={textMute} strokeWidth={1.2} fill="none" strokeDasharray="3,4" opacity={0.6} />
      <Path d="M 40 70  Q 100 80 130 110 T 200 110" stroke={textMute} strokeWidth={1.2} fill="none" strokeDasharray="3,4" opacity={0.6} />

      {/* точка события */}
      <Circle cx="200" cy="110" r="6" fill={accent} />
      <Circle cx="200" cy="110" r="12" fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />

      {/* правая зона — прямая стрелка "так оно и должно было быть" */}
      <Line x1="200" y1="110" x2="350" y2="110" stroke={accent} strokeWidth={2.5} />
      <Path d="M 340 102 L 360 110 L 340 118" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* вертикальная разделительная линия "событие" */}
      <Line x1="200" y1="40" x2="200" y2="160" stroke={accentDim} strokeWidth={0.8} strokeDasharray="2,3" />
    </Svg>
  );
}
