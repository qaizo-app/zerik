import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function HotHandFallacy({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Shot dots along court: ✓ = hit, ✗ = miss
  const shots = [
    { x: 55,  y: 95, hit: true },
    { x: 100, y: 95, hit: true },
    { x: 145, y: 95, hit: true },
    { x: 190, y: 95, hit: true },
    { x: 235, y: 95, hit: true },
    { x: 280, y: 95, hit: false },
    { x: 325, y: 95, hit: false },
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Court line */}
      <Line x1="35" y1="110" x2="380" y2="110" stroke={mute} strokeWidth={1.5} strokeOpacity={0.3} />

      {/* "HOT STREAK" label */}
      <Text x="142" y="50" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.7}>HOT STREAK</Text>
      <Path d="M 55 56 L 235 56" fill="none" stroke={accent} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="2,2" />

      {shots.map((s, i) => (
        <g key={i}>
          <Circle cx={s.x} cy={s.y} r="14"
            fill={s.hit ? accent : mute}
            fillOpacity={s.hit ? 0.18 : 0.08}
            stroke={s.hit ? accent : mute}
            strokeWidth={1.5}
            strokeOpacity={s.hit ? 0.7 : 0.3}
          />
          <Text x={s.x} y={s.y + 5} textAnchor="middle"
            fontFamily="sans-serif" fontSize="13" fontWeight="bold"
            fill={s.hit ? accent : mute}
            fillOpacity={s.hit ? 0.9 : 0.4}
          >{s.hit ? '✓' : '✗'}</Text>
        </g>
      ))}

      {/* Expected next shot — question mark */}
      <Rect x="352" y="72" width="32" height="32" rx="8"
        fill={accent} fillOpacity={0.1} stroke={accent} strokeWidth={1.5} strokeDasharray="3,2" strokeOpacity={0.6} />
      <Text x="368" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="15" fontWeight="bold" fill={accent} fillOpacity={0.7}>?</Text>

      <Text x="200" y="148" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        each shot is independent — streak is random
      </Text>
    </Svg>
  );
}
