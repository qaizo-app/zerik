import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function ScarcityIllusion({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Arms reaching toward the item
  const arms = [
    { x1: 50,  y1: 130, x2: 170, y2: 90 },
    { x1: 90,  y1: 155, x2: 175, y2: 100 },
    { x1: 350, y1: 130, x2: 232, y2: 90 },
    { x1: 310, y1: 155, x2: 228, y2: 100 },
    { x1: 200, y1: 165, x2: 200, y2: 115 },
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* The scarce item */}
      <Rect x="168" y="60" width="64" height="50" rx="8"
        fill={accent} fillOpacity={0.18} stroke={accent} strokeWidth={2} strokeOpacity={0.8} />
      <Text x="200" y="82" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={accent} fillOpacity={0.9}>ITEM</Text>
      {/* "Last 1!" badge */}
      <Rect x="196" y="91" width="38" height="14" rx="7" fill={accent} fillOpacity={0.9} />
      <Text x="215" y="102" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill={bg}>LAST 1</Text>

      {/* Arms */}
      {arms.map((arm, i) => (
        <Line key={i}
          x1={arm.x1} y1={arm.y1} x2={arm.x2} y2={arm.y2}
          stroke={dim} strokeWidth={3} strokeOpacity={0.22 + i * 0.04}
          strokeLinecap="round"
        />
      ))}

      {/* Crowd silhouette dots */}
      {[60,100,145,200,255,300,342].map((cx, i) => (
        <Circle key={i} cx={cx} cy={165} r={i === 3 ? 10 : 7}
          fill={mute} fillOpacity={0.22} />
      ))}

      <Text x="200" y="20" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        availability ↓  desire ↑
      </Text>
    </Svg>
  );
}
