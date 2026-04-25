// Occam's Razor — слева клубок запутанных линий, посередине вертикальная
// бирюзовая бритва, справа простой круг. Палитра mental_models — teal.
// Перенесено из mockups/mental_model_occam-1.html.

import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Pattern,
  Circle,
  Rect,
  Path,
  Line,
  G,
  Text as SvgText
} from 'react-native-svg';

export default function OccamRazor({ palette, width = '100%', height = 180 }) {
  const accent     = palette?.accent     || '#5EEAD4';
  const accentDim  = palette?.accent_dim || '#2A9D8F';
  const bgElev     = palette?.bg_elev    || '#171B21';
  const textPrim   = palette?.text       || '#E4E7EC';
  const textMute   = palette?.text_mute  || '#5C6472';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <LinearGradient id="oc_teal" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={accent} />
          <Stop offset="100%" stopColor={accentDim} />
        </LinearGradient>
        <Pattern id="oc_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>

      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#oc_grain)" />

      {/* запутанные линии слева */}
      <G transform="translate(50, 90)" stroke={textMute} strokeWidth={1} fill="none" opacity={0.7}>
        <Path d="M -30 -40 Q 0 -20 20 0 T 40 30 Q 20 40 -10 30 T -30 10 Q -40 -10 -20 -30 T 10 -20" />
        <Path d="M -20 -30 Q 30 -10 10 20 T -30 40 Q -50 0 -10 -40" />
        <Path d="M 0 -50 Q 30 -20 0 10 T -20 40 Q -40 10 -10 -40" />
        <Circle cx="-20" cy="-20" r="3" fill={textMute} />
        <Circle cx="15"  cy="0"   r="3" fill={textMute} />
        <Circle cx="-5"  cy="25"  r="3" fill={textMute} />
        <Circle cx="25"  cy="-25" r="3" fill={textMute} />
      </G>

      {/* бритва — вертикаль посередине */}
      <G transform="translate(200, 90)">
        <Line x1="0" y1="-70" x2="0" y2="70" stroke="url(#oc_teal)" strokeWidth={2} />
        <Circle cx="0" cy="-70" r="4" fill={accent} />
        <Circle cx="0" cy="70"  r="4" fill={accent} />
        <Line x1="-6" y1="-78" x2="6" y2="-78" stroke={accent} strokeWidth={1.5} />
      </G>

      {/* простая чистая форма справа */}
      <G transform="translate(320, 90)">
        <Circle cx="0" cy="0" r="32" fill="none" stroke="url(#oc_teal)" strokeWidth={2} />
        <Circle cx="0" cy="0" r="6"  fill={accent} />
      </G>

      {/* лейблы */}
      <SvgText
        x="50" y="160" textAnchor="middle"
        fontFamily="JetBrainsMono-Regular" fontSize="9"
        fill={textMute} letterSpacing="1.5"
      >СЛОЖНО</SvgText>
      <SvgText
        x="320" y="160" textAnchor="middle"
        fontFamily="JetBrainsMono-Regular" fontSize="9"
        fill={accent} letterSpacing="1.5"
      >ПРОСТО</SvgText>
    </Svg>
  );
}
