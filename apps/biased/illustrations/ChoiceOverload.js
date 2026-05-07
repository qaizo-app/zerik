// Сетка одинаковых банок: чем больше выбора, тем меньше выбираешь.

import Svg, { Defs, Pattern, Circle, Rect, Path, G } from 'react-native-svg';

export default function ChoiceOverload({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // 6×3 grid of jars
  const jars = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      jars.push([55 + c * 50, 35 + r * 50]);
    }
  }

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="co_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#co_g)" />

      {jars.map(([x, y], i) => (
        <G key={i}>
          <Rect x={x - 12} y={y - 14} width={24} height={4} fill={mute} fillOpacity={0.5} />
          <Rect x={x - 13} y={y - 10} width={26} height={32} rx={2} fill="none" stroke={mute} strokeWidth={1.2} strokeOpacity={0.5} />
        </G>
      ))}

      {/* one accent jar at top-left */}
      <Rect x={42} y={21} width={24} height={4} fill={accent} />
      <Rect x={41} y={25} width={26} height={32} rx={2} fill="none" stroke={accent} strokeWidth={1.5} />

      {/* scribbled question mark of indecision */}
      <Path d="M 350 90 Q 360 75 372 85 Q 380 95 365 100 L 365 110" fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="365" cy="120" r="2" fill={accent} />
    </Svg>
  );
}
