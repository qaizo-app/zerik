// Толпа стрелок в одну сторону + одна одинокая в противоход.

import Svg, { Defs, Pattern, Circle, Rect, Path, G } from 'react-native-svg';

export default function BandwagonEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  const arrows = [
    [70, 50], [120, 50], [170, 50], [220, 50], [270, 50], [320, 50],
    [70, 80], [120, 80], [170, 80], [220, 80], [270, 80], [320, 80],
    [70, 110], [120, 110], [170, 110], [270, 110], [320, 110],
    [70, 140], [120, 140], [170, 140], [220, 140], [270, 140], [320, 140],
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="bw_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#bw_g)" />

      <G stroke={mute} strokeWidth={1.4} strokeLinecap="round" fill="none">
        {arrows.map(([x, y], i) => (
          <G key={i}>
            <Path d={`M ${x} ${y} L ${x + 22} ${y}`} />
            <Path d={`M ${x + 17} ${y - 4} L ${x + 22} ${y} L ${x + 17} ${y + 4}`} />
          </G>
        ))}
      </G>

      {/* lone arrow going against — accent */}
      <G stroke={accent} strokeWidth={2} strokeLinecap="round" fill="none">
        <Path d="M 242 110 L 220 110" />
        <Path d="M 225 106 L 220 110 L 225 114" />
      </G>
    </Svg>
  );
}
