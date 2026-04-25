// Anchoring — большой якорь тянет шкалу. Цифра рядом с якорем — "стартовое".
// Шкала смещена в сторону якоря.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function Anchoring({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="an_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#an_grain)" />

      {/* шкала — горизонтальная, с делениями */}
      <Line x1="40" y1="60" x2="360" y2="60" stroke={textMute} strokeWidth={1.2} />
      {[80, 130, 180, 230, 280, 330].map((x, i) => (
        <Line key={i} x1={x} y1={56} x2={x} y2={64} stroke={textMute} strokeWidth={0.8} />
      ))}

      {/* "якорь" — большая цифра-плотный круг и трос */}
      <Line x1="120" y1="60" x2="120" y2="135" stroke={accentDim} strokeWidth={2} />
      <Path
        d="M 105 135 Q 120 165 135 135 M 100 130 L 105 140 M 140 130 L 135 140 M 120 130 L 120 152"
        fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round"
      />
      <Circle cx="120" cy="148" r="3" fill={accent} />

      {/* стрелка — "ответ сместился к якорю" */}
      <Line x1="240" y1="60" x2="135" y2="60" stroke={accent} strokeWidth={1.5} strokeDasharray="4,4" />
      <Path d="M 142 56 L 132 60 L 142 64" fill="none" stroke={accent} strokeWidth={1.5} />
      <Circle cx="240" cy="60" r="4" fill={textMute} />

      {/* подпись якоря */}
      <SvgText x="120" y="42" textAnchor="middle" fontFamily="JetBrainsMono-Bold" fontSize="14" fill={accent}>65</SvgText>
      <SvgText x="240" y="42" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="11" fill={textMute}>?</SvgText>
    </Svg>
  );
}
