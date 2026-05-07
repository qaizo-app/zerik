// Бумеранг: бросаешь факт — он возвращается с большей силой исходного убеждения.

import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';

export default function BackfireEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="bf_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#bf_g)" />

      {/* curved trajectory — out and back */}
      <Path
        d="M 80 130 Q 200 -10 320 130"
        fill="none" stroke={accent} strokeWidth={2} strokeDasharray="5,5"
      />
      <Path
        d="M 320 130 Q 250 160 80 140"
        fill="none" stroke={accent} strokeWidth={2.5}
      />

      {/* arrowhead returning */}
      <Path d="M 90 132 L 78 140 L 92 148" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* boomerang shape at apex */}
      <Path
        d="M 195 25 L 215 20 L 210 40 L 205 36 L 200 42 L 195 36 Z"
        fill={accent}
      />

      {/* origin / target — same belief, stronger */}
      <Circle cx="80"  cy="135" r="6" fill={mute} fillOpacity={0.5} />
      <Circle cx="80"  cy="135" r="11" fill="none" stroke={accent} strokeWidth={1.5} />
      <Circle cx="80"  cy="135" r="16" fill="none" stroke={accent} strokeWidth={1} strokeOpacity={0.5} />
    </Svg>
  );
}
