import Svg, { Circle, Defs, RadialGradient, Stop, Rect, Text, Line } from 'react-native-svg';

export default function InGroupBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // In-group: tight cluster left, warm colour
  const inGroup = [
    [130, 85], [112, 70], [148, 70], [120, 100], [140, 100], [130, 58],
  ];
  // Out-group: scattered right, cold/dim
  const outGroup = [
    [270, 80], [255, 65], [290, 65], [260, 100], [285, 98], [275, 55],
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* In-group glow */}
      <Circle cx="130" cy="82" r="52" fill={accent} fillOpacity={0.07} />
      <Circle cx="130" cy="82" r="52" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.35} />

      {/* Out-group border */}
      <Circle cx="272" cy="80" r="48" fill="none" stroke={mute} strokeWidth={1} strokeDasharray="4,3" strokeOpacity={0.25} />

      {/* In-group dots */}
      {inGroup.map(([cx, cy], i) => (
        <Circle key={`in${i}`} cx={cx} cy={cy} r="8" fill={accent} fillOpacity={0.6 + i * 0.04} />
      ))}

      {/* Out-group dots */}
      {outGroup.map(([cx, cy], i) => (
        <Circle key={`out${i}`} cx={cx} cy={cy} r="8" fill={mute} fillOpacity={0.25} />
      ))}

      {/* Labels */}
      <Text x="130" y="152" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.8}>US</Text>
      <Text x="272" y="148" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>THEM</Text>

      {/* Divider */}
      <Line x1="200" y1="30" x2="200" y2="150" stroke={mute} strokeWidth={1} strokeDasharray="5,4" strokeOpacity={0.2} />
    </Svg>
  );
}
