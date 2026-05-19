import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function SelfServingBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Central figure (ME) */}
      <Circle cx="200" cy="70" r="22" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.7} />
      <Text x="200" y="75" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill={accent} fillOpacity={0.9}>ME</Text>

      {/* SUCCESS arrow pointing TO me */}
      <Rect x="30" y="32" width="72" height="24" rx="5" fill={dim} fillOpacity={0.12} stroke={dim} strokeWidth={1} strokeOpacity={0.4} />
      <Text x="66" y="49" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.8}>✓ success</Text>
      {/* arrow: from success box → me */}
      <Path d="M 102 44 L 172 62" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.7} />
      <Path d="M 168 57 L 175 62 L 168 67" fill={accent} fillOpacity={0.7} />
      <Text x="137" y="47" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.7} transform="rotate(16,137,47)">my skill</Text>

      {/* FAILURE arrow pointing AWAY from me */}
      <Rect x="300" y="32" width="74" height="24" rx="5" fill={mute} fillOpacity={0.1} stroke={mute} strokeWidth={1} strokeOpacity={0.3} />
      <Text x="337" y="49" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.7}>✗ failure</Text>
      {/* arrow: from me → failure */}
      <Path d="M 225 62 L 296 44" fill="none" stroke={mute} strokeWidth={2} strokeOpacity={0.5} />
      <Path d="M 294 49 L 300 44 L 294 39" fill={mute} fillOpacity={0.5} />
      <Text x="261" y="45" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.6} transform="rotate(-16,261,45)">bad luck</Text>

      {/* External factors below */}
      <Rect x="120" y="130" width="72" height="22" rx="4" fill={mute} fillOpacity={0.08} stroke={mute} strokeWidth={1} strokeOpacity={0.25} />
      <Text x="156" y="145" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.55}>the system</Text>

      <Rect x="208" y="130" width="72" height="22" rx="4" fill={mute} fillOpacity={0.08} stroke={mute} strokeWidth={1} strokeOpacity={0.25} />
      <Text x="244" y="145" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.55}>other people</Text>

      <Path d="M 200 92 L 156 130" fill="none" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.35} />
      <Path d="M 200 92 L 244 130" fill="none" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.35} />
    </Svg>
  );
}
