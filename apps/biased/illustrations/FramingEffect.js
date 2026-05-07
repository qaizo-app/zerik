// Одно содержание в двух рамках: «90% выживут» vs «10% умрут».

import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

export default function FramingEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="fr_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
        <Pattern id="fr_dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <Circle cx="5" cy="5" r="2.2" fill={accent} fillOpacity={0.35} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#fr_g)" />

      {/* same content (dots pattern) */}
      <Rect x="60"  y="50" width="100" height="80" fill="url(#fr_dots)" />
      <Rect x="240" y="50" width="100" height="80" fill="url(#fr_dots)" />

      {/* frame 1 — accent (positive frame) */}
      <Rect x="60"  y="50" width="100" height="80" fill="none" stroke={accent} strokeWidth={2.5} />
      {/* frame 2 — muted (negative frame) */}
      <Rect x="240" y="50" width="100" height="80" fill="none" stroke={mute} strokeWidth={2.5} strokeDasharray="6,4" />

      {/* connector — same content */}
      <Rect x="170" y="86" width="60" height="8" fill={mute} fillOpacity={0.3} />
    </Svg>
  );
}
