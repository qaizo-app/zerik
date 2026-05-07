// Один прожектор на маленькой фигуре — кажется, на тебя смотрят все.
// На самом деле — никто.

import Svg, { Defs, Pattern, RadialGradient, Stop, Circle, Rect, Path } from 'react-native-svg';

export default function SpotlightEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="sp_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
        <RadialGradient id="sp_beam" cx="0.5" cy="0" r="0.7">
          <Stop offset="0%" stopColor={accent} stopOpacity={0.6} />
          <Stop offset="100%" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#sp_g)" />

      {/* spotlight beam — wide cone */}
      <Path d="M 200 30 L 130 165 L 270 165 Z" fill="url(#sp_beam)" />
      {/* spotlight outline */}
      <Path d="M 200 30 L 130 165 L 270 165 Z" fill="none" stroke={accent} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3,4" />

      {/* tiny figure under spotlight */}
      <Circle cx="200" cy="115" r="6" fill={accent} />
      <Path d="M 192 122 L 194 150 L 200 150 L 200 130 L 200 150 L 206 150 L 208 122 Z" fill={accent} />

      {/* indifferent observers (around, not looking) */}
      <Circle cx="50"  cy="75"  r="5" fill={mute} fillOpacity={0.5} />
      <Circle cx="60"  cy="125" r="5" fill={mute} fillOpacity={0.5} />
      <Circle cx="345" cy="80"  r="5" fill={mute} fillOpacity={0.5} />
      <Circle cx="350" cy="130" r="5" fill={mute} fillOpacity={0.5} />
    </Svg>
  );
}
