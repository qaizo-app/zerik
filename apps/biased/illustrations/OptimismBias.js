import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

export default function OptimismBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Axes */}
      <Line x1="50" y1="20" x2="50" y2="145" stroke={mute} strokeWidth={1.2} strokeOpacity={0.4} />
      <Line x1="50" y1="145" x2="370" y2="145" stroke={mute} strokeWidth={1.2} strokeOpacity={0.4} />
      <Text x="30" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5} transform="rotate(-90,30,90)">probability</Text>
      <Text x="210" y="162" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5}>outcome</Text>

      {/* Actual bell curve — centred at 200, neutral */}
      <Path d="M 60 143 Q 90 143 110 130 Q 140 110 160 80 Q 175 60 190 53 Q 200 48 210 53 Q 225 60 240 80 Q 260 110 290 130 Q 310 143 340 143"
        fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.5} strokeDasharray="4,3" />
      <Text x="200" y="44" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5}>reality</Text>

      {/* Optimistic curve — shifted right, peak higher */}
      <Path d="M 100 143 Q 130 143 160 125 Q 195 98 220 65 Q 240 42 260 36 Q 270 32 280 36 Q 300 42 320 68 Q 345 98 360 130 Q 370 143 380 143"
        fill="none" stroke={accent} strokeWidth={2.5} strokeOpacity={0.85} />
      <Text x="270" y="27" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.9}>self-estimate</Text>

      {/* Arrow showing shift */}
      <Path d="M 200 120 L 265 120" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.5} />
      <Path d="M 260 116 L 267 120 L 260 124" fill={accent} fillOpacity={0.7} />
      <Text x="233" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.6}>shifted</Text>
    </Svg>
  );
}
