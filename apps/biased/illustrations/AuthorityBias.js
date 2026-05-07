// Корона/знак отличия — сама по себе перевешивает аргумент.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function AuthorityBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="au_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#au_g)" />

      {/* fulcrum */}
      <Line x1="200" y1="50" x2="200" y2="155" stroke={mute} strokeWidth={2} />
      <Line x1="180" y1="158" x2="220" y2="158" stroke={mute} strokeWidth={3} strokeLinecap="round" />

      {/* tilted beam — authority side heavy */}
      <Line x1="100" y1="90" x2="300" y2="50" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* left pan — ARGUMENT (light) — geometric brackets */}
      <Line x1="100" y1="90" x2="100" y2="108" stroke={accent} strokeWidth={1.2} strokeOpacity={0.6} />
      <Path d="M 70 108 Q 100 138 130 108 Z" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
      <Path d="M 80 112 L 88 120 M 95 112 L 88 120 L 88 130 M 110 112 L 118 130" fill="none" stroke={mute} strokeWidth={1.2} />

      {/* right pan — AUTHORITY (heavy) — crown */}
      <Line x1="300" y1="50" x2="300" y2="68" stroke={accent} strokeWidth={1.2} />
      <Path d="M 270 68 Q 300 98 330 68 Z" fill="none" stroke={accent} strokeWidth={2} />
      {/* crown */}
      <Path d="M 280 80 L 285 65 L 295 76 L 300 60 L 305 76 L 315 65 L 320 80 Z" fill={accent} />
      <Rect x="280" y="80" width="40" height="3" fill={accent} />
    </Svg>
  );
}
