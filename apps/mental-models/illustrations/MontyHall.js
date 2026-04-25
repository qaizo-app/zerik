// Monty Hall — три двери. Левая закрыта. Правая закрыта. Средняя открыта,
// внутри коза (силуэт). Намёк: одна из закрытых = машина.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function MontyHall({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#6366F1';
  const accentDim = palette?.accent_dim || '#3F4AC4';
  const bgElev    = palette?.bg_elev    || '#141828';
  const textPrim  = palette?.text       || '#DEE2EE';
  const textMute  = palette?.text_mute  || '#5C6478';

  function closedDoor(x, label, picked) {
    const stroke = picked ? accent : textMute;
    const strokeW = picked ? 2.5 : 1.5;
    return (
      <G>
        <Rect x={x} y="40" width="60" height="100" fill="none" stroke={stroke} strokeWidth={strokeW} />
        <Circle cx={x + 50} cy="92" r="2.5" fill={stroke} />
        <SvgText x={x + 30} y="160" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="11" fill={stroke} letterSpacing="1.5">{label}</SvgText>
      </G>
    );
  }

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="mh_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#mh_grain)" />

      {/* пол / горизонт */}
      <Line x1="20" y1="140" x2="380" y2="140" stroke={accentDim} strokeWidth={0.5} opacity={0.5} />

      {/* три двери */}
      {closedDoor(60, '1', true)}

      {/* средняя дверь — открыта, видна "коза" (стилизованный треугольник + точка) */}
      <G>
        <Rect x="170" y="40" width="60" height="100" fill="none" stroke={textMute} strokeWidth={1} strokeDasharray="3,3" />
        <Path d="M 180 110 L 200 80 L 220 110 Z" fill={textMute} opacity={0.45} />
        <Circle cx="200" cy="76" r="4" fill={textMute} opacity={0.45} />
        <SvgText x="200" y="160" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="11" fill={textMute} letterSpacing="1.5">2</SvgText>
        <SvgText x="200" y="32" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">КОЗА</SvgText>
      </G>

      {closedDoor(280, '3', false)}

      {/* стрелка — "сменить выбор" */}
      <Path d="M 100 30 Q 200 12 320 30" fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="3,4" />
      <Path d="M 314 26 L 322 30 L 314 34" fill="none" stroke={accent} strokeWidth={1.2} />
    </Svg>
  );
}
