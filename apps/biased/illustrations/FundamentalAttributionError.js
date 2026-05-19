import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function FundamentalAttributionError({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Left figure — THEM (observed, no context) */}
      <Circle cx="120" cy="55" r="18" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.6} />
      {/* face */}
      <Circle cx="114" cy="52" r="2" fill={dim} fillOpacity={0.6} />
      <Circle cx="126" cy="52" r="2" fill={dim} fillOpacity={0.6} />
      <Path d="M 113 62 Q 120 58 127 62" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.4} />
      {/* body */}
      <Line x1="120" y1="73" x2="120" y2="110" stroke={dim} strokeWidth={2} strokeOpacity={0.5} />
      <Line x1="95"  y1="88" x2="145" y2="88" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="120" y1="110" x2="105" y2="130" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="120" y1="110" x2="135" y2="130" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />

      {/* Label: "bad person" in accent */}
      <Rect x="82" y="140" width="76" height="20" rx="4" fill={accent} fillOpacity={0.15} />
      <Text x="120" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent}>bad person</Text>

      {/* Right figure — ME (same behavior, situation visible) */}
      <Circle cx="280" cy="55" r="18" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.6} />
      <Circle cx="274" cy="52" r="2" fill={dim} fillOpacity={0.6} />
      <Circle cx="286" cy="52" r="2" fill={dim} fillOpacity={0.6} />
      <Path d="M 273 62 Q 280 58 287 62" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.4} />
      <Line x1="280" y1="73"  x2="280" y2="110" stroke={dim} strokeWidth={2} strokeOpacity={0.5} />
      <Line x1="255" y1="88"  x2="305" y2="88"  stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="280" y1="110" x2="265" y2="130" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Line x1="280" y1="110" x2="295" y2="130" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />

      {/* Situation context cloud around right figure */}
      <Path d="M238 40 Q230 20 250 18 Q255 5 270 10 Q278 2 290 10 Q308 4 315 20 Q330 22 325 40 Q330 55 315 58 Q310 70 295 65 Q285 75 270 68 Q252 74 245 62 Q230 60 238 40 Z"
        fill="none" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.5} />
      <Text x="280" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.7}>bad day</Text>
      <Text x="280" y="42" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.7}>no sleep · late</Text>

      {/* Label: "understandable" */}
      <Rect x="238" y="140" width="84" height="20" rx="4" fill={mute} fillOpacity={0.12} />
      <Text x="280" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.7}>understandable</Text>

      {/* Divider */}
      <Line x1="200" y1="30" x2="200" y2="160" stroke={mute} strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.3} />
    </Svg>
  );
}
