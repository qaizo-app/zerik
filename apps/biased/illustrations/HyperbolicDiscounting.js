import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function HyperbolicDiscounting({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Axes */}
      <Line x1="50" y1="20" x2="50" y2="145" stroke={mute} strokeWidth={1.2} strokeOpacity={0.35} />
      <Line x1="50" y1="145" x2="380" y2="145" stroke={mute} strokeWidth={1.2} strokeOpacity={0.35} />
      <Text x="28" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.45} transform="rotate(-90,28,90)">value</Text>
      <Text x="215" y="162" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.45}>delay</Text>

      {/* Hyperbolic curve: steep drop near now, flattening later */}
      <Path d="M 55 28 Q 75 50 100 80 Q 140 115 200 130 Q 260 140 340 143"
        fill="none" stroke={accent} strokeWidth={2.5} strokeOpacity={0.85} />

      {/* Exponential (rational) curve for comparison */}
      <Path d="M 55 55 Q 120 80 200 110 Q 280 132 340 143"
        fill="none" stroke={mute} strokeWidth={1.5} strokeDasharray="4,3" strokeOpacity={0.4} />
      <Text x="350" y="108" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.4}>rational</Text>

      {/* Annotation: $10 now vs $15 in a week */}
      <Circle cx="55" cy="28" r="5" fill={accent} fillOpacity={0.9} />
      <Text x="68" y="24" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.9}>$10 NOW</Text>

      <Circle cx="175" cy="122" r="4" fill={dim} fillOpacity={0.5} />
      <Text x="150" y="112" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.55}>$15 later?</Text>
      <Line x1="162" y1="114" x2="173" y2="119" stroke={dim} strokeWidth={1} strokeOpacity={0.4} />

      {/* Label */}
      <Text x="200" y="24" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.7}>smaller-sooner wins</Text>
    </Svg>
  );
}
