import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function StatusQuoBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Scale pole */}
      <Line x1="200" y1="40" x2="200" y2="130" stroke={mute} strokeWidth={2} strokeOpacity={0.5} />
      {/* Base */}
      <Line x1="170" y1="130" x2="230" y2="130" stroke={mute} strokeWidth={2.5} strokeOpacity={0.5} />

      {/* Beam — tilted: left side (NOW) is heavy/down, right side (CHANGE) is light/up */}
      <Line x1="90" y1="80" x2="310" y2="62" stroke={dim} strokeWidth={2} strokeOpacity={0.7} />
      <Circle cx="200" cy="71" r="4" fill={mute} fillOpacity={0.6} />

      {/* Left pan (NOW) — heavy, lower */}
      <Line x1="90" y1="80" x2="90" y2="110" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="72" y1="110" x2="108" y2="110" stroke={accent} strokeWidth={2.5} />
      <Rect x="74" y="111" width="32" height="20" rx="4" fill={accent} fillOpacity={0.85} />
      <Text x="90" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={bg} fontWeight="bold">NOW</Text>

      {/* Right pan (CHANGE) — light, higher */}
      <Line x1="310" y1="62" x2="310" y2="92" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="293" y1="92" x2="327" y2="92" stroke={mute} strokeWidth={1.5} strokeOpacity={0.5} />
      <Rect x="295" y="93" width="30" height="14" rx="3" fill={mute} fillOpacity={0.25} />
      <Text x="310" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={dim} fillOpacity={0.6}>CHANGE</Text>

      {/* Down arrow next to NOW pan */}
      <Path d="M 90 140 L 85 148 L 90 148 L 90 155 L 95 155 L 95 148 L 100 148 Z" fill={accent} fillOpacity={0.7} />
    </Svg>
  );
}
