// Якорь тянет лодку вниз: чем больше вложено, тем сильнее держит.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function SunkCostFallacy({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="sc_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#sc_g)" />

      {/* waterline */}
      <Line x1="20" y1="80" x2="380" y2="80" stroke={mute} strokeWidth={1} strokeDasharray="3,4" />

      {/* boat (tilted, sinking) */}
      <Path
        d="M 130 75 L 270 70 L 250 95 L 150 98 Z"
        fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round"
      />
      <Line x1="200" y1="40" x2="200" y2="72" stroke={accent} strokeWidth={1.5} />
      <Path d="M 200 40 L 230 50 L 200 60 Z" fill={accent} fillOpacity={0.6} />

      {/* anchor chain pulling down */}
      <Line x1="200" y1="98" x2="200" y2="135" stroke={accent} strokeWidth={2} strokeOpacity={0.5} />
      <Path
        d="M 185 135 Q 200 165 215 135 M 180 130 L 185 140 M 220 130 L 215 140 M 200 130 L 200 152"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />
      <Circle cx="200" cy="148" r="3" fill={accent} />

      {/* depth marks (cost accumulating) */}
      <Line x1="40" y1="100" x2="60" y2="100" stroke={mute} strokeWidth={1} />
      <Line x1="40" y1="120" x2="60" y2="120" stroke={mute} strokeWidth={1} />
      <Line x1="40" y1="140" x2="60" y2="140" stroke={mute} strokeWidth={1} />
      <Line x1="40" y1="160" x2="60" y2="160" stroke={mute} strokeWidth={1} />
    </Svg>
  );
}
