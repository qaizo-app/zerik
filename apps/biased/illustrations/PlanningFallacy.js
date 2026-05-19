import Svg, { Line, Path, Rect, Text, Defs, Marker } from 'react-native-svg';

export default function PlanningFallacy({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Y axis */}
      <Line x1="60" y1="20" x2="60" y2="145" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />
      {/* X axis */}
      <Line x1="60" y1="145" x2="370" y2="145" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />

      {/* X labels */}
      <Text x="60"  y="160" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.6}>start</Text>
      <Text x="370" y="160" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.6}>done</Text>

      {/* Planned timeline bar — short, green-ish */}
      <Rect x="80" y="72" width="100" height="22" rx="4" fill={dim} fillOpacity={0.25} />
      <Text x="130" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.8}>PLANNED</Text>

      {/* Planned end tick */}
      <Line x1="180" y1="65" x2="180" y2="145" stroke={dim} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.35} />

      {/* Actual timeline bar — much longer, amber */}
      <Rect x="80" y="105" width="270" height="22" rx="4" fill={accent} fillOpacity={0.25} />
      <Text x="215" y="121" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent}>ACTUAL</Text>

      {/* Actual end tick */}
      <Line x1="350" y1="100" x2="350" y2="145" stroke={accent} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.5} />

      {/* Gap brace */}
      <Path d="M 180 50 L 180 42 L 350 42 L 350 50" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
      <Text x="265" y="36" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.9}>×2.7 longer</Text>
    </Svg>
  );
}
