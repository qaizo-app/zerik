import Svg, { Circle, Line, Rect, Text, Path } from 'react-native-svg';

export default function RecencyBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Events along timeline: old → recent
  const events = [
    { x: 60,  size: 5,  opacity: 0.2 },
    { x: 100, size: 5,  opacity: 0.22 },
    { x: 145, size: 6,  opacity: 0.25 },
    { x: 185, size: 7,  opacity: 0.3 },
    { x: 230, size: 8,  opacity: 0.38 },
    { x: 270, size: 14, opacity: 0.6  },
    { x: 310, size: 20, opacity: 0.82 },
    { x: 355, size: 28, opacity: 1.0  },
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Timeline axis */}
      <Line x1="40" y1="105" x2="390" y2="105" stroke={mute} strokeWidth={1.5} strokeOpacity={0.35} />

      {/* Past / Now labels */}
      <Text x="40"  y="125" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.4}>PAST</Text>
      <Text x="380" y="125" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.8}>NOW</Text>

      {/* Events as circles growing toward present */}
      {events.map((ev, i) => (
        <Circle key={i} cx={ev.x} cy={105} r={ev.size}
          fill={accent} fillOpacity={ev.opacity * 0.3}
          stroke={accent} strokeWidth={1.5} strokeOpacity={ev.opacity}
        />
      ))}

      {/* Weight label over recent event */}
      <Text x="355" y="65" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.9}>
        weighs most
      </Text>
      <Line x1="355" y1="68" x2="355" y2="77" stroke={accent} strokeWidth={1} strokeOpacity={0.6} />

      {/* Small label over distant events */}
      <Text x="100" y="72" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.4}>
        forgotten
      </Text>
    </Svg>
  );
}
