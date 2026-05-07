// Воронка пропускает «тёплые» точки (одобрение); холодные отскакивают.

import Svg, { Defs, Pattern, Circle, Rect, Path, G } from 'react-native-svg';

export default function ConfirmationBias({ palette = {}, width = '100%', height = 180 }) {
  const accent  = palette.accent  || '#F5A623';
  const bg      = palette.bg_elev || '#0F1E30';
  const dim     = palette.text    || '#B0C8DF';
  const mute    = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="cb_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#cb_g)" />

      <Path
        d="M 130 40 L 270 40 L 220 100 L 220 150 L 180 150 L 180 100 Z"
        fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round"
      />
      <Circle cx="200" cy="60" r="5" fill={accent} />
      <Circle cx="200" cy="120" r="4" fill={accent} fillOpacity={0.85} />
      <Circle cx="200" cy="160" r="3" fill={accent} fillOpacity={0.6} />

      <G stroke={mute} strokeWidth={1.2} strokeDasharray="2,3" fill="none">
        <Path d="M 100 50 Q 130 35 165 55" />
        <Path d="M 300 50 Q 270 35 235 55" />
        <Path d="M 90 95 Q 110 80 145 60" />
        <Path d="M 310 95 Q 290 80 255 60" />
      </G>
      <Circle cx="100" cy="50" r="3" fill={mute} fillOpacity={0.6} />
      <Circle cx="300" cy="50" r="3" fill={mute} fillOpacity={0.6} />
      <Circle cx="90"  cy="95" r="3" fill={mute} fillOpacity={0.5} />
      <Circle cx="310" cy="95" r="3" fill={mute} fillOpacity={0.5} />
    </Svg>
  );
}
