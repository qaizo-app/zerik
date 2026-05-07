// Один тёмный круг среди светлых — и он притягивает всё внимание.

import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

export default function NegativityBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // grid of light circles
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 8; c++) {
      cells.push([60 + c * 40, 40 + r * 35]);
    }
  }
  const darkIndex = 13; // one stand-out

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="ng_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#ng_g)" />

      {cells.map(([x, y], i) =>
        i === darkIndex ? (
          <Circle key={i} cx={x} cy={y} r={9} fill={accent} />
        ) : (
          <Circle key={i} cx={x} cy={y} r={6} fill={mute} fillOpacity={0.4} />
        )
      )}

      {/* attention rings around the dark one */}
      <Circle cx={cells[darkIndex][0]} cy={cells[darkIndex][1]} r={16} fill="none" stroke={accent} strokeWidth={1.2} strokeOpacity={0.6} />
      <Circle cx={cells[darkIndex][0]} cy={cells[darkIndex][1]} r={24} fill="none" stroke={accent} strokeWidth={1} strokeOpacity={0.3} />
    </Svg>
  );
}
