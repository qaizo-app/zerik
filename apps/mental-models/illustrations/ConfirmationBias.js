// Confirmation Bias — воронка пропускает только "тёплый" цвет (одобрение),
// холодные данные отскакивают. Фильтр в действии.

import Svg, { Defs, LinearGradient, Stop, Pattern, Circle, Rect, Path, G } from 'react-native-svg';

export default function ConfirmationBias({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <LinearGradient id="cb_warm" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={accent} />
          <Stop offset="100%" stopColor={accentDim} />
        </LinearGradient>
        <Pattern id="cb_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#cb_grain)" />

      {/* воронка */}
      <Path
        d="M 130 40 L 270 40 L 220 100 L 220 150 L 180 150 L 180 100 Z"
        fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round"
      />

      {/* "одобрённые" точки идут вниз сквозь воронку */}
      <Circle cx="200" cy="60" r="5" fill="url(#cb_warm)" />
      <Circle cx="200" cy="120" r="4" fill="url(#cb_warm)" opacity={0.85} />
      <Circle cx="200" cy="160" r="3" fill="url(#cb_warm)" opacity={0.6} />

      {/* "отвергнутые" точки отскакивают */}
      <G stroke={textMute} strokeWidth={1.2} strokeDasharray="2,3" fill="none">
        <Path d="M 100 50 Q 130 35 165 55" />
        <Path d="M 300 50 Q 270 35 235 55" />
        <Path d="M 90 90 Q 110 75 145 55" />
        <Path d="M 310 90 Q 290 75 255 55" />
      </G>
      <Circle cx="100" cy="50"  r="3" fill={textMute} opacity={0.6} />
      <Circle cx="300" cy="50"  r="3" fill={textMute} opacity={0.6} />
      <Circle cx="90"  cy="90"  r="3" fill={textMute} opacity={0.5} />
      <Circle cx="310" cy="90"  r="3" fill={textMute} opacity={0.5} />
      <Circle cx="80"  cy="130" r="3" fill={textMute} opacity={0.4} />
      <Circle cx="320" cy="130" r="3" fill={textMute} opacity={0.4} />
    </Svg>
  );
}
