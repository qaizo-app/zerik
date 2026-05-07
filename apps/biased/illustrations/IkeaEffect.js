// Кривая, кустарная табуретка с гордым сердечком — «зато моё».

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function IkeaEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="ik_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#ik_g)" />

      {/* lopsided stool — top */}
      <Path d="M 150 75 L 260 70 L 270 85 L 145 88 Z" fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round" />
      {/* legs (uneven) */}
      <Line x1="160" y1="88" x2="155" y2="150" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <Line x1="200" y1="88" x2="208" y2="148" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <Line x1="250" y1="85" x2="240" y2="155" stroke={accent} strokeWidth={2} strokeLinecap="round" />

      {/* a stray nail */}
      <Line x1="225" y1="78" x2="225" y2="68" stroke={mute} strokeWidth={1.4} />
      <Circle cx="225" cy="68" r="1.5" fill={mute} />

      {/* heart above (pride) */}
      <Path
        d="M 320 50 Q 312 42 305 48 Q 298 56 320 70 Q 342 56 335 48 Q 328 42 320 50 Z"
        fill={accent} fillOpacity={0.85}
      />
    </Svg>
  );
}
