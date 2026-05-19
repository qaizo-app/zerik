import Svg, { Circle, Line, Rect, Text, Path } from 'react-native-svg';

export default function GamblersFallacy({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  const coins = ['H', 'H', 'H', 'H', 'H', 'H'];
  const cx = [40, 90, 140, 190, 240, 290];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Coins row */}
      {coins.map((label, i) => (
        <>
          <Circle key={`c${i}`} cx={cx[i]} cy={72} r={26} fill={accent} fillOpacity={0.15} stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
          <Text key={`t${i}`} x={cx[i]} y={77} textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={accent} fillOpacity={0.85}>{label}</Text>
        </>
      ))}

      {/* "NEXT must be T" thought — dim box */}
      <Rect x="316" y="46" width="70" height="52" rx="8" fill={mute} fillOpacity={0.12} stroke={accent} strokeWidth={1.5} strokeOpacity={0.5} strokeDasharray="4,3" />
      <Text x="351" y="68" textAnchor="middle" fontFamily="sans-serif" fontSize="16" fontWeight="bold" fill={accent} fillOpacity={0.9}>T</Text>
      <Text x="351" y="84" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={accent} fillOpacity={0.6}>must be!</Text>

      {/* Actual probability label */}
      <Text x="200" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill={dim} fillOpacity={0.5}>
        Each flip: 50 / 50. Always.
      </Text>

      {/* Cross over "must be T" */}
      <Line x1="320" y1="50" x2="382" y2="94" stroke={dim} strokeWidth={1.5} strokeOpacity={0.3} />
      <Line x1="382" y1="50" x2="320" y2="94" stroke={dim} strokeWidth={1.5} strokeOpacity={0.3} />
    </Svg>
  );
}
