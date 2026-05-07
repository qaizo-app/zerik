// Повтор → форма проявляется. То, что часто видишь, начинает нравиться.

import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

export default function MereExposureEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Same shape, repeated, getting more solid/visible left → right
  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="me_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#me_g)" />

      {/* sequence of squares — opacity ramps up */}
      {[
        { x: 40,  o: 0.1 },
        { x: 100, o: 0.25 },
        { x: 160, o: 0.45 },
        { x: 220, o: 0.7 },
        { x: 280, o: 1 },
      ].map((s, i) => (
        <Rect
          key={i}
          x={s.x} y={50}
          width={50} height={80}
          fill={accent}
          fillOpacity={s.o}
          stroke={accent}
          strokeWidth={1}
          strokeOpacity={Math.min(1, s.o + 0.2)}
        />
      ))}

      {/* underline: the repetition axis */}
      <Rect x="40" y="145" width="290" height="1.5" fill={mute} fillOpacity={0.6} />

      {/* tick marks (each exposure) */}
      {[55, 115, 175, 235, 295].map((x, i) => (
        <Rect key={i} x={x - 1} y={145} width={2} height={6} fill={mute} fillOpacity={0.6} />
      ))}
    </Svg>
  );
}
