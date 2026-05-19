import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function BeliefPerseverance({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Central belief shield */}
      <Path d="M 200 35 L 260 60 L 260 115 Q 260 145 200 158 Q 140 145 140 115 L 140 60 Z"
        fill={accent} fillOpacity={0.1} stroke={accent} strokeWidth={2} strokeOpacity={0.6} />
      <Text x="200" y="100" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill={accent} fillOpacity={0.9}>BELIEF</Text>
      <Text x="200" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.6}>(unchanged)</Text>

      {/* Evidence arrows — bouncing off */}
      {/* Left arrow */}
      <Path d="M 55 75 L 132 95" fill="none" stroke={dim} strokeWidth={2} strokeOpacity={0.5} />
      <Path d="M 128 91 L 135 95 L 128 99" fill={dim} fillOpacity={0.5} />
      {/* Deflect left */}
      <Path d="M 133 95 L 100 115" fill="none" stroke={mute} strokeWidth={1.5} strokeDasharray="3,2" strokeOpacity={0.4} />

      {/* Right arrow */}
      <Path d="M 345 75 L 268 95" fill="none" stroke={dim} strokeWidth={2} strokeOpacity={0.5} />
      <Path d="M 272 91 L 265 95 L 272 99" fill={dim} fillOpacity={0.5} />
      {/* Deflect right */}
      <Path d="M 267 95 L 300 115" fill="none" stroke={mute} strokeWidth={1.5} strokeDasharray="3,2" strokeOpacity={0.4} />

      {/* Evidence labels */}
      <Rect x="20" y="58" width="56" height="20" rx="4" fill={dim} fillOpacity={0.08} stroke={dim} strokeWidth={1} strokeOpacity={0.3} />
      <Text x="48" y="72" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={dim} fillOpacity={0.6}>evidence</Text>

      <Rect x="324" y="58" width="56" height="20" rx="4" fill={dim} fillOpacity={0.08} stroke={dim} strokeWidth={1} strokeOpacity={0.3} />
      <Text x="352" y="72" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={dim} fillOpacity={0.6}>evidence</Text>

      <Text x="200" y="25" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        contradicting facts → belief strengthens
      </Text>
    </Svg>
  );
}
