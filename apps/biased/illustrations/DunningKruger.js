// Кривая уверенности: пик глупости → долина → плато компетентности.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function DunningKruger({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="dk_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#dk_g)" />

      {/* axes */}
      <Line x1="40" y1="150" x2="370" y2="150" stroke={mute} strokeWidth={1} />
      <Line x1="40" y1="30" x2="40" y2="150" stroke={mute} strokeWidth={1} />

      {/* curve: peak → valley → plateau */}
      <Path
        d="M 50 130 Q 90 40 130 60 Q 170 80 210 130 Q 250 145 290 110 Q 330 85 360 80"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />

      {/* peak marker */}
      <Circle cx="115" cy="50" r="4" fill={accent} />
      {/* valley marker */}
      <Circle cx="215" cy="135" r="3" fill={mute} />
      {/* plateau marker */}
      <Circle cx="350" cy="80" r="3" fill={accent} fillOpacity={0.7} />
    </Svg>
  );
}
