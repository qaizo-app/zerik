import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function ActionBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Goal — half-circle goal mouth */}
      <Path d="M 168 52 L 168 132 Q 168 148 200 148 Q 232 148 232 132 L 232 52"
        fill="none" stroke={mute} strokeWidth={2} strokeOpacity={0.4} />
      <Text x="200" y="142" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.35}>GOAL</Text>

      {/* Goalkeeper — diving LEFT */}
      <Circle cx="155" cy="90" r="12" fill={dim} fillOpacity={0.15} stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      <Text x="155" y="94" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.6}>GK</Text>
      {/* Dive arrow */}
      <Path d="M 168 90 L 140 90" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.6} />
      <Path d="M 143 86 L 137 90 L 143 94" fill={accent} fillOpacity={0.6} />
      <Text x="130" y="78" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={accent} fillOpacity={0.6}>DIVES</Text>

      {/* Ball — going centre */}
      <Circle cx="340" cy="90" r="12" fill={accent} fillOpacity={0.2} stroke={accent} strokeWidth={1.5} strokeOpacity={0.7} />
      <Text x="340" y="94" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.8}>●</Text>
      {/* Ball trajectory — centre */}
      <Path d="M 328 90 L 236 90" fill="none" stroke={accent} strokeWidth={1.5} strokeDasharray="4,3" strokeOpacity={0.5} />
      <Path d="M 239 86 L 232 90 L 239 94" fill={accent} fillOpacity={0.5} />

      {/* Staying-still option — ghost GK in centre */}
      <Circle cx="200" cy="90" r="11" fill={dim} fillOpacity={0.05} stroke={dim} strokeWidth={1} strokeDasharray="3,2" strokeOpacity={0.2} />
      <Text x="200" y="94" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={dim} fillOpacity={0.2}>stay</Text>

      <Text x="200" y="25" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        diving feels better — even when standing still works
      </Text>
    </Svg>
  );
}
