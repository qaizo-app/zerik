// График эмоций по времени: пик и конец отмечены — память берёт средне их.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function PeakEndRule({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="pe_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#pe_g)" />

      {/* axes */}
      <Line x1="40" y1="150" x2="370" y2="150" stroke={mute} strokeWidth={1} />
      <Line x1="40" y1="30" x2="40" y2="150" stroke={mute} strokeWidth={1} />

      {/* experience curve — chaotic with one peak and end */}
      <Path
        d="M 50 110 L 80 95 L 110 130 L 140 100 L 170 60 L 200 55 L 220 100 L 250 90 L 285 130 L 320 105 L 355 70"
        fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.7}
      />

      {/* peak marker */}
      <Circle cx="200" cy="55" r="5" fill={accent} />
      <Line x1="200" y1="62" x2="200" y2="150" stroke={accent} strokeWidth={1} strokeDasharray="2,3" strokeOpacity={0.6} />

      {/* end marker */}
      <Circle cx="355" cy="70" r="5" fill={accent} />
      <Line x1="355" y1="77" x2="355" y2="150" stroke={accent} strokeWidth={1} strokeDasharray="2,3" strokeOpacity={0.6} />

      {/* memory line — average of peak + end */}
      <Line x1="40" y1="62" x2="370" y2="62" stroke={accent} strokeWidth={1.5} strokeOpacity={0.5} />
    </Svg>
  );
}
