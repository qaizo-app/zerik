// Один объект окружён сиянием — все рядом теряются в его тени.

import Svg, { Defs, Pattern, RadialGradient, Stop, Circle, Rect } from 'react-native-svg';

export default function HaloEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="ha_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
        <RadialGradient id="ha_glow" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0%" stopColor={accent} stopOpacity={0.5} />
          <Stop offset="60%" stopColor={accent} stopOpacity={0.1} />
          <Stop offset="100%" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#ha_g)" />

      {/* halo */}
      <Circle cx="200" cy="90" r="80" fill="url(#ha_glow)" />
      {/* central object */}
      <Circle cx="200" cy="90" r="14" fill={accent} />
      <Circle cx="200" cy="90" r="22" fill="none" stroke={accent} strokeWidth={1.2} strokeOpacity={0.7} />

      {/* surrounding lesser objects, dimmed */}
      <Circle cx="80"  cy="60"  r="10" fill={mute} fillOpacity={0.5} />
      <Circle cx="60"  cy="120" r="9"  fill={mute} fillOpacity={0.4} />
      <Circle cx="320" cy="55"  r="9"  fill={mute} fillOpacity={0.45} />
      <Circle cx="345" cy="120" r="11" fill={mute} fillOpacity={0.5} />
    </Svg>
  );
}
