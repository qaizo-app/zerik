import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function DecoyEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Axes: X=price, Y=quality */}
      <Line x1="50" y1="25" x2="50" y2="148" stroke={mute} strokeWidth={1.2} strokeOpacity={0.35} />
      <Line x1="50" y1="148" x2="380" y2="148" stroke={mute} strokeWidth={1.2} strokeOpacity={0.35} />
      <Text x="28" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.4} transform="rotate(-90,28,90)">quality</Text>
      <Text x="215" y="164" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.4}>price</Text>

      {/* A — cheap & low quality */}
      <Circle cx="100" cy="125" r="10" fill={mute} fillOpacity={0.2} stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />
      <Text x="100" y="129" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill={mute} fillOpacity={0.6}>A</Text>
      <Text x="100" y="143" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.35}>$5</Text>

      {/* B — mid price & high quality (TARGET) */}
      <Circle cx="220" cy="50" r="14" fill={accent} fillOpacity={0.2} stroke={accent} strokeWidth={2} strokeOpacity={0.8} />
      <Text x="220" y="55" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill={accent} fillOpacity={0.9}>B</Text>
      <Text x="220" y="73" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={accent} fillOpacity={0.6}>$12</Text>

      {/* C — decoy: same price as B, lower quality */}
      <Circle cx="220" cy="100" r="9" fill={dim} fillOpacity={0.1} stroke={dim} strokeWidth={1} strokeDasharray="3,2" strokeOpacity={0.35} />
      <Text x="220" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.4}>C</Text>
      <Text x="220" y="118" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.3}>$12</Text>
      <Text x="255" y="100" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.4}>decoy</Text>
      <Path d="M 248 99 L 231 100" fill="none" stroke={mute} strokeWidth={1} strokeOpacity={0.3} />

      {/* Arrow: C makes B look better */}
      <Path d="M 220 91 L 220 65" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.5} />
      <Path d="M 216 68 L 220 61 L 224 68" fill={accent} fillOpacity={0.5} />
      <Text x="240" y="80" fontFamily="sans-serif" fontSize="7" fill={accent} fillOpacity={0.6}>B wins</Text>
    </Svg>
  );
}
