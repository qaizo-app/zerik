import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function NormalcyBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Central calm figure */}
      <Circle cx="200" cy="80" r="28" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.5} />
      {/* calm face */}
      <Circle cx="192" cy="76" r="2.5" fill={dim} fillOpacity={0.6} />
      <Circle cx="208" cy="76" r="2.5" fill={dim} fillOpacity={0.6} />
      <Path d="M 193 88 Q 200 92 207 88" fill="none" stroke={dim} strokeWidth={2} strokeOpacity={0.5} strokeLinecap="round" />

      {/* Warning signs around — red-ish */}
      {/* Top warning */}
      <Path d="M 200 20 L 215 48 L 185 48 Z" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.7} />
      <Text x="200" y="43" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={accent} fillOpacity={0.8}>!</Text>

      {/* Left warning */}
      <Path d="M 80 70 L 95 98 L 65 98 Z" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.5} />
      <Text x="80" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={accent} fillOpacity={0.6}>!</Text>

      {/* Right warning */}
      <Path d="M 320 70 L 335 98 L 305 98 Z" fill="none" stroke={accent} strokeWidth={2} strokeOpacity={0.5} />
      <Text x="320" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill={accent} fillOpacity={0.6}>!</Text>

      {/* Arrows from warnings toward figure — blocked/deflected */}
      <Path d="M 200 50 L 200 55" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.4} />
      <Path d="M 100 80 L 160 80" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.3} />
      <Path d="M 300 80 L 240 80" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.3} />

      {/* Deflection marks — bounce off */}
      <Path d="M 200 57 L 193 63 M 200 57 L 207 63" fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />
      <Path d="M 162 77 L 158 72 M 162 77 L 158 82" fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />
      <Path d="M 238 77 L 242 72 M 238 77 L 242 82" fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />

      {/* Bottom text */}
      <Text x="200" y="150" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>"It won't happen to me."</Text>
    </Svg>
  );
}
