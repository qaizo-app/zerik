// Pareto 80/20 — два столбца. Маленький слева (20% input) → большой справа
// (80% output). Видимая асимметрия.

import Svg, { Defs, LinearGradient, Stop, Pattern, Circle, Rect, Path, G, Text as SvgText } from 'react-native-svg';

export default function Pareto({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#5EEAD4';
  const accentDim = palette?.accent_dim || '#2A9D8F';
  const bgElev    = palette?.bg_elev    || '#171B21';
  const textPrim  = palette?.text       || '#E4E7EC';
  const textMute  = palette?.text_mute  || '#5C6472';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <LinearGradient id="pr_teal" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={accent} />
          <Stop offset="100%" stopColor={accentDim} />
        </LinearGradient>
        <Pattern id="pr_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#pr_grain)" />

      {/* базовая линия */}
      <Path d="M 40 145 L 360 145" stroke={textMute} strokeWidth={0.8} />

      {/* малый столбец слева — 20% input */}
      <Rect x="100" y="120" width="50" height="25" fill={accentDim} />
      <SvgText x="125" y="172" textAnchor="middle" fontFamily="JetBrainsMono-Bold" fontSize="13" fill={textMute}>20%</SvgText>
      <SvgText x="125" y="110" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">УСИЛИЕ</SvgText>

      {/* большой столбец справа — 80% output */}
      <Rect x="240" y="45" width="50" height="100" fill="url(#pr_teal)" />
      <SvgText x="265" y="172" textAnchor="middle" fontFamily="JetBrainsMono-Bold" fontSize="13" fill={accent}>80%</SvgText>
      <SvgText x="265" y="35" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={accent} letterSpacing="1.5">РЕЗУЛЬТАТ</SvgText>

      {/* стрелка между ними */}
      <Path d="M 160 95 Q 200 75 230 95" fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="3,4" />
      <Path d="M 224 91 L 232 95 L 224 99" fill="none" stroke={accent} strokeWidth={1.2} />
    </Svg>
  );
}
