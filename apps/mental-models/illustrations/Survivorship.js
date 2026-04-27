// Survivorship — самолёт с пробоинами на крыльях и хвосте, но не на корпусе.
// Дыры там где не критично — их видно, потому что эти самолёты ВЕРНУЛИСЬ.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function Survivorship({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="sv_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#sv_grain)" />

      {/* силуэт самолёта (вид сверху) */}
      <Path
        d="M 200 40 L 215 80 L 285 100 L 285 115 L 215 105 L 215 130 L 240 145 L 240 158 L 200 152 L 160 158 L 160 145 L 185 130 L 185 105 L 115 115 L 115 100 L 185 80 Z"
        fill="none" stroke={textMute} strokeWidth={1.5}
      />

      {/* пробоины (видимые) — на крыльях и хвосте, не на корпусе */}
      {/* левое крыло */}
      <Circle cx="135" cy="103" r="3" fill={accent} />
      <Circle cx="155" cy="100" r="3" fill={accent} />
      <Circle cx="170" cy="108" r="3" fill={accent} />
      <Circle cx="145" cy="110" r="2.5" fill={accent} />
      {/* правое крыло */}
      <Circle cx="265" cy="103" r="3" fill={accent} />
      <Circle cx="245" cy="100" r="3" fill={accent} />
      <Circle cx="230" cy="108" r="3" fill={accent} />
      <Circle cx="255" cy="110" r="2.5" fill={accent} />
      {/* хвост */}
      <Circle cx="190" cy="148" r="2.5" fill={accent} />
      <Circle cx="210" cy="148" r="2.5" fill={accent} />

      {/* критичная зона — корпус и моторы — без видимых дыр (но именно туда били тех кто не вернулся) */}
      <Path d="M 195 75 L 195 130 M 205 75 L 205 130" stroke={textMute} strokeWidth={0.5} strokeDasharray="2,3" opacity={0.5} />

      {/* подпись-указатель */}
      <Line x1="50"  y1="50"  x2="120" y2="95"  stroke={textMute} strokeWidth={0.6} strokeDasharray="2,3" />
      <Circle cx="50" cy="50" r="2" fill={textMute} />
    </Svg>
  );
}
