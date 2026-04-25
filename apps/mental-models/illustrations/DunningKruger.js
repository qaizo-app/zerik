// Dunning-Kruger — классический график. Пик «горы глупости» слева, долина
// отчаяния посередине, плато компетентности справа.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function DunningKruger({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="dk_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#dk_grain)" />

      {/* оси */}
      <Line x1="40" y1="150" x2="380" y2="150" stroke={textMute} strokeWidth={0.8} />
      <Line x1="40" y1="30"  x2="40"  y2="150" stroke={textMute} strokeWidth={0.8} />

      {/* подпись осей */}
      <SvgText x="220" y="170" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">ЗНАНИЕ</SvgText>
      <SvgText x="22" y="90" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5" transform="rotate(-90 22 90)">УВЕРЕННОСТЬ</SvgText>

      {/* кривая — пик новичка, долина, плато */}
      <Path
        d="M 50 130 Q 90 35 130 50 Q 170 70 210 130 Q 250 145 290 110 Q 330 80 370 78"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />

      {/* три точки-маркера */}
      <Circle cx="115" cy="42" r="4" fill={accent} />
      <Circle cx="210" cy="130" r="4" fill={accentDim} />
      <Circle cx="370" cy="78" r="4" fill={accent} />
    </Svg>
  );
}
