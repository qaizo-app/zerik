import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function CurseOfKnowledge({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Expert — left */}
      <Circle cx="90" cy="55" r="20" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.7} />
      <Text x="90" y="60" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill={accent} fontWeight="bold">EXP</Text>
      <Text x="90" y="83" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.7}>expert</Text>

      {/* Expert speech bubble — complex, full of symbols */}
      <Path d="M 115 30 Q 200 10 200 55 Q 200 80 150 82 L 140 95 L 145 82 Q 115 80 115 55 Z"
        fill={accent} fillOpacity={0.08} stroke={accent} strokeWidth={1} strokeOpacity={0.4} />
      <Text x="160" y="40" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.8}>∂²f/∂x²</Text>
      <Text x="160" y="53" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.8}>→ O(n log n)</Text>
      <Text x="160" y="66" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.8}>∑ Σ ∫ λ α β</Text>

      {/* Novice — right */}
      <Circle cx="310" cy="55" r="20" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Text x="310" y="60" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill={dim} fillOpacity={0.6}>NOV</Text>
      <Text x="310" y="83" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.7}>novice</Text>

      {/* Novice thought bubble — question marks */}
      <Path d="M 285 30 Q 200 10 200 55 Q 200 80 250 82 L 260 95 L 255 82 Q 285 80 285 55 Z"
        fill={mute} fillOpacity={0.06} stroke={mute} strokeWidth={1} strokeOpacity={0.3} />
      <Text x="240" y="52" textAnchor="middle" fontFamily="sans-serif" fontSize="20" fill={mute} fillOpacity={0.4}>???</Text>

      {/* Arrow between them */}
      <Line x1="115" y1="55" x2="200" y2="55" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.3} />
      <Line x1="200" y1="55" x2="285" y2="55" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.3} />

      {/* Barrier in the middle */}
      <Rect x="192" y="38" width="16" height="34" rx="3" fill={mute} fillOpacity={0.15} stroke={mute} strokeWidth={1} strokeOpacity={0.3} />
      <Text x="200" y="59" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.6} transform="rotate(-90,200,55)">CURSE</Text>

      {/* Bottom note */}
      <Text x="200" y="140" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        "It's obvious" — to the expert only
      </Text>
    </Svg>
  );
}
