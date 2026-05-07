// Большой якорь тянет шкалу: ответ смещён к стартовому числу.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function AnchoringEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="an_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#an_g)" />

      <Line x1="40" y1="60" x2="360" y2="60" stroke={mute} strokeWidth={1.2} />
      {[80, 130, 180, 230, 280, 330].map((x, i) => (
        <Line key={i} x1={x} y1={56} x2={x} y2={64} stroke={mute} strokeWidth={0.8} />
      ))}

      <Line x1="120" y1="60" x2="120" y2="135" stroke={accent} strokeWidth={2} strokeOpacity={0.6} />
      <Path
        d="M 105 135 Q 120 165 135 135 M 100 130 L 105 140 M 140 130 L 135 140 M 120 130 L 120 152"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />
      <Circle cx="120" cy="148" r="3" fill={accent} />

      <Line x1="240" y1="60" x2="135" y2="60" stroke={accent} strokeWidth={1.5} strokeDasharray="4,4" />
      <Path d="M 142 56 L 132 60 L 142 64" fill="none" stroke={accent} strokeWidth={1.5} />
      <Circle cx="240" cy="60" r="4" fill={mute} />
    </Svg>
  );
}
