// Весы: потеря тяжелее равного выигрыша. Чашка слева ниже.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function LossAversion({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="la_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#la_g)" />

      {/* fulcrum / column */}
      <Line x1="200" y1="40" x2="200" y2="150" stroke={mute} strokeWidth={2} />
      <Line x1="180" y1="155" x2="220" y2="155" stroke={mute} strokeWidth={3} strokeLinecap="round" />

      {/* beam — tilted (loss side heavier, lower-left) */}
      <Line x1="100" y1="80" x2="300" y2="40" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />

      {/* left pan — loss (heavy) */}
      <Line x1="100" y1="80" x2="100" y2="100" stroke={accent} strokeWidth={1.2} />
      <Path d="M 70 100 Q 100 130 130 100 Z" fill="none" stroke={accent} strokeWidth={2} />
      {/* loss weight — accent */}
      <Rect x="85" y="105" width="30" height="14" fill={accent} fillOpacity={0.7} />

      {/* right pan — gain (light) */}
      <Line x1="300" y1="40" x2="300" y2="60" stroke={accent} strokeWidth={1.2} strokeOpacity={0.7} />
      <Path d="M 270 60 Q 300 90 330 60 Z" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.7} />
      {/* gain weight — smaller, muted */}
      <Rect x="290" y="63" width="20" height="10" fill={mute} fillOpacity={0.6} />
    </Svg>
  );
}
