import Svg, { Circle, Path, Rect, Text } from 'react-native-svg';

export default function FalseConsensusEffect({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* LEFT: Perceived — big "agree" slice */}
      <Text x="100" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.5}>perceived</Text>
      {/* Pie: 75% agree (accent), 25% disagree (mute) */}
      {/* 75% = 270° arc. Start at top (-90°), sweep 270° CW */}
      {/* agree slice */}
      <Path d="M 100 90 L 100 45 A 45 45 0 1 1 55.1 112.5 Z"
        fill={accent} fillOpacity={0.7} />
      {/* disagree slice */}
      <Path d="M 100 90 L 55.1 112.5 A 45 45 0 0 1 100 45 Z"
        fill={mute} fillOpacity={0.25} />
      <Text x="110" y="78" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={bg}>75%</Text>
      <Text x="100" y="145" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.8}>agree</Text>

      {/* RIGHT: Actual — 40% agree */}
      <Text x="300" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.5}>actual</Text>
      {/* 40% = 144° arc */}
      <Path d="M 300 90 L 300 45 A 45 45 0 0 1 328.9 117.6 Z"
        fill={accent} fillOpacity={0.5} />
      {/* 60% disagree */}
      <Path d="M 300 90 L 328.9 117.6 A 45 45 0 1 1 300 45 Z"
        fill={mute} fillOpacity={0.2} />
      <Text x="310" y="74" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={accent} fillOpacity={0.9}>40%</Text>
      <Text x="300" y="145" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.7}>agree</Text>

      {/* Arrow showing overestimation */}
      <Path d="M 155 90 L 245 90" stroke={mute} strokeWidth={1} strokeDasharray="3,3" strokeOpacity={0.4} />
      <Text x="200" y="85" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5}>overestimate</Text>
    </Svg>
  );
}
