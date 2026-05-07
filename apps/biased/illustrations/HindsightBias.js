// Зеркало заднего вида: всё в нём выглядит очевидно — задним числом.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G } from 'react-native-svg';

export default function HindsightBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="hb_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#hb_g)" />

      {/* mirror frame */}
      <Path
        d="M 130 50 L 270 50 Q 285 50 285 65 L 285 115 Q 285 130 270 130 L 130 130 Q 115 130 115 115 L 115 65 Q 115 50 130 50 Z"
        fill="none" stroke={accent} strokeWidth={2.5}
      />
      {/* mirror stem */}
      <Line x1="200" y1="130" x2="200" y2="155" stroke={accent} strokeWidth={2} />
      <Line x1="180" y1="155" x2="220" y2="155" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* "obvious in retrospect" — a clean arrow pointing back inside the mirror */}
      <G stroke={accent} strokeWidth={1.8} fill="none" strokeLinecap="round">
        <Path d="M 250 90 L 160 90" />
        <Path d="M 170 80 L 158 90 L 170 100" />
      </G>

      {/* events behind: receding dots */}
      <Circle cx="320" cy="90" r="3" fill={mute} fillOpacity={0.8} />
      <Circle cx="345" cy="90" r="2" fill={mute} fillOpacity={0.5} />
      <Circle cx="365" cy="90" r="1.5" fill={mute} fillOpacity={0.3} />
    </Svg>
  );
}
