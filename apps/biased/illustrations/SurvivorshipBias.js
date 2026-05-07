// Силуэт самолёта с пробоинами в местах, где пули НЕ были смертельны
// (вернувшиеся самолёты — выжившие). Концепт WW2 Wald.

import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';

export default function SurvivorshipBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="sv_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#sv_g)" />

      {/* plane top-down silhouette */}
      <Path
        d="M 200 40 L 210 80 L 320 90 L 320 105 L 215 110 L 218 145 L 250 152 L 250 160 L 200 158 L 150 160 L 150 152 L 182 145 L 185 110 L 80 105 L 80 90 L 190 80 Z"
        fill="none" stroke={mute} strokeWidth={1.4} strokeLinejoin="round"
      />

      {/* "survivor" hits — non-lethal areas highlighted */}
      <Circle cx="240" cy="95" r="3" fill={accent} />
      <Circle cx="135" cy="95" r="3" fill={accent} />
      <Circle cx="295" cy="100" r="2.5" fill={accent} />
      <Circle cx="105" cy="100" r="2.5" fill={accent} />
      <Circle cx="220" cy="135" r="2.5" fill={accent} />
      <Circle cx="180" cy="135" r="2.5" fill={accent} />

      {/* missing data = engines/cockpit (the lethal hits never returned) */}
      <Circle cx="200" cy="100" r="6" fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="2,2" />
      <Circle cx="200" cy="55"  r="4" fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="2,2" />
    </Svg>
  );
}
