import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function OstrichEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Ground */}
      <Line x1="20" y1="148" x2="380" y2="148" stroke={mute} strokeWidth={1.5} strokeOpacity={0.3} />

      {/* Ostrich body */}
      <Circle cx="160" cy="110" r="32" fill={mute} fillOpacity={0.12} stroke={mute} strokeWidth={1.5} strokeOpacity={0.35} />

      {/* Neck going into ground */}
      <Path d="M 155 110 Q 158 130 160 148 Q 162 148 165 130 Q 167 118 165 110"
        fill={mute} fillOpacity={0.2} />

      {/* Head underground (below line) */}
      <Circle cx="160" cy="158" r="10" fill={mute} fillOpacity={0.15} stroke={mute} strokeWidth={1} strokeOpacity={0.25} />

      {/* Legs */}
      <Line x1="148" y1="140" x2="135" y2="170" stroke={mute} strokeWidth={2.5} strokeOpacity={0.3} strokeLinecap="round" />
      <Line x1="172" y1="140" x2="185" y2="170" stroke={mute} strokeWidth={2.5} strokeOpacity={0.3} strokeLinecap="round" />

      {/* Bad news charts / warnings nearby */}
      {/* Chart 1 — downward */}
      <Rect x="240" y="60" width="80" height="55" rx="6" fill={accent} fillOpacity={0.07} stroke={accent} strokeWidth={1.5} strokeOpacity={0.4} />
      <Path d="M 250 75 L 265 82 L 280 70 L 295 88 L 310 100"
        fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.6} />
      <Text x="280" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.5}>bad news</Text>

      {/* Chart 2 */}
      <Rect x="240" y="25" width="80" height="30" rx="5" fill={mute} fillOpacity={0.07} stroke={mute} strokeWidth={1} strokeOpacity={0.25} />
      <Text x="280" y="45" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.4}>portfolio ↓ 12%</Text>

      {/* "Not looking" arrow */}
      <Path d="M 195 100 Q 215 90 236 80" fill="none" stroke={mute} strokeWidth={1.5} strokeDasharray="3,3" strokeOpacity={0.3} />
      <Path d="M 190 103 L 193 97 L 198 101" fill={mute} fillOpacity={0.2} />
      <Text x="215" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.3}>ignoring</Text>
    </Svg>
  );
}
