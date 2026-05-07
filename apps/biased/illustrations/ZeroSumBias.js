// Пирог фиксированного размера, разделён на части — но мог бы расти, не растёт.

import Svg, { Defs, Pattern, Circle, Rect, Path, G } from 'react-native-svg';

export default function ZeroSumBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // pie slices — 4 portions
  const cx = 200, cy = 90, r = 60;
  const slices = [
    { start: 0,        end: Math.PI / 2,         fill: accent,           opacity: 0.7 },
    { start: Math.PI / 2,  end: Math.PI,         fill: mute,             opacity: 0.5 },
    { start: Math.PI,      end: 3 * Math.PI / 2, fill: accent,           opacity: 0.4 },
    { start: 3 * Math.PI / 2, end: 2 * Math.PI,  fill: mute,             opacity: 0.6 },
  ];

  function slicePath(start, end) {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="zs_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#zs_g)" />

      {slices.map((s, i) => (
        <Path key={i} d={slicePath(s.start, s.end)} fill={s.fill} fillOpacity={s.opacity} stroke={bg} strokeWidth={1.5} />
      ))}
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth={2} />

      {/* "fixed" label boundary — outer ring locked */}
      <Circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={mute} strokeWidth={1} strokeDasharray="3,4" />

      {/* opposing arrows showing tug */}
      <G stroke={mute} strokeWidth={1.5} strokeLinecap="round" fill="none" strokeOpacity={0.7}>
        <Path d="M 90 90 L 115 90" />
        <Path d="M 100 84 L 92 90 L 100 96" />
        <Path d="M 310 90 L 285 90" />
        <Path d="M 300 84 L 308 90 L 300 96" />
      </G>
    </Svg>
  );
}
