import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function BystanderEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Bystanders arranged in a ring
  const bystanders = [
    [200, 40], [260, 60], [295, 105], [270, 150], [130, 150], [105, 105], [140, 60],
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Person in need — centre */}
      <Circle cx="200" cy="95" r="20" fill={accent} fillOpacity={0.15} stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
      <Text x="200" y="100" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.85}>HELP!</Text>

      {/* Bystanders */}
      {bystanders.map(([cx, cy], i) => (
        <g key={i}>
          <Circle cx={cx} cy={cy} r="11" fill="none" stroke={mute} strokeWidth={1.2} strokeOpacity={0.4} />
          {/* fraction of responsibility */}
          <Text x={cx} y={cy + 4} textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.35}>1/7</Text>
        </g>
      ))}

      {/* Dashed lines from bystanders to center */}
      {bystanders.map(([cx, cy], i) => (
        <Line key={`l${i}`}
          x1={cx} y1={cy}
          x2={200 + (cx - 200) * 0.5}
          y2={95  + (cy - 95)  * 0.5}
          stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.25}
        />
      ))}

      {/* Bottom label */}
      <Text x="200" y="173" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        7 witnesses → each feels 1/7 responsible
      </Text>
    </Svg>
  );
}
