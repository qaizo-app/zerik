// Ship of Theseus — пять прямоугольников-досок, левые тёмные (старые),
// правые акцентные (заменённые). Постепенное обновление.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function Theseus({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#A78BFA';
  const accentDim = palette?.accent_dim || '#7C5FE0';
  const bgElev    = palette?.bg_elev    || '#1A1424';
  const textPrim  = palette?.text       || '#E8E2F0';
  const textMute  = palette?.text_mute  || '#6B6478';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="ts_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#ts_grain)" />

      {/* корпус корабля — горизонтальный pat */}
      {/* доски — слева тёмные старые, справа яркие новые */}
      {[
        { x: 60,  fill: textMute,  opacity: 0.35 },
        { x: 110, fill: textMute,  opacity: 0.55 },
        { x: 160, fill: accentDim, opacity: 0.7 },
        { x: 210, fill: accentDim, opacity: 0.9 },
        { x: 260, fill: accent,    opacity: 1 },
        { x: 310, fill: accent,    opacity: 1 }
      ].map((p, i) => (
        <Rect key={i} x={p.x} y="80" width="40" height="40" fill={p.fill} fillOpacity={p.opacity} />
      ))}

      {/* борт-обводка */}
      <Path d="M 50 80 L 360 80 L 350 130 L 60 130 Z" fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round" />

      {/* мачта */}
      <Line x1="200" y1="80" x2="200" y2="30" stroke={accent} strokeWidth={2} />
      <Path d="M 200 35 L 240 60 L 200 60 Z" fill={accent} opacity={0.6} />

      {/* волны */}
      <Path d="M 30 145 Q 60 138 90 145 Q 120 152 150 145 Q 180 138 210 145 Q 240 152 270 145 Q 300 138 330 145 Q 360 152 380 145"
        fill="none" stroke={textMute} strokeWidth={1} opacity={0.5} />

      {/* стрелка времени */}
      <Line x1="60" y1="160" x2="350" y2="160" stroke={textMute} strokeWidth={0.8} strokeDasharray="2,3" />
      <Path d="M 343 156 L 351 160 L 343 164" fill="none" stroke={textMute} strokeWidth={0.8} />
      <SvgText x="60" y="173" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">СТАРЫЕ</SvgText>
      <SvgText x="350" y="173" textAnchor="end" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={accent} letterSpacing="1.5">НОВЫЕ</SvgText>
    </Svg>
  );
}
