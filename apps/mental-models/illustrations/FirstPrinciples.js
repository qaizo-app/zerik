// First Principles — справа сложная конструкция, слева её атомы.
// Стрелка показывает разборку до основ.

import Svg, { Defs, LinearGradient, Stop, Pattern, Circle, Rect, Path, Line, G } from 'react-native-svg';

export default function FirstPrinciples({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#5EEAD4';
  const accentDim = palette?.accent_dim || '#2A9D8F';
  const bgElev    = palette?.bg_elev    || '#171B21';
  const textPrim  = palette?.text       || '#E4E7EC';
  const textMute  = palette?.text_mute  || '#5C6472';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="fp_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#fp_grain)" />

      {/* справа — сложный объект из множества линий */}
      <G transform="translate(310, 90)" stroke={textMute} strokeWidth={1} fill="none">
        <Rect x="-30" y="-35" width="60" height="70" />
        <Path d="M -30 -35 L 30 35 M 30 -35 L -30 35 M 0 -35 L 0 35 M -30 0 L 30 0" />
        <Circle cx="-15" cy="-15" r="3" fill={textMute} />
        <Circle cx="15" cy="-15" r="3" fill={textMute} />
        <Circle cx="-15" cy="15" r="3" fill={textMute} />
        <Circle cx="15" cy="15" r="3" fill={textMute} />
      </G>

      {/* стрелка — разборка */}
      <Line x1="240" y1="90" x2="160" y2="90" stroke={accent} strokeWidth={1.5} strokeDasharray="4,4" />
      <Path d="M 165 86 L 158 90 L 165 94" fill="none" stroke={accent} strokeWidth={1.5} />

      {/* слева — атомы: 4 простых круга */}
      <G transform="translate(80, 90)">
        <Circle cx="-25" cy="-25" r="10" fill="none" stroke={accent} strokeWidth={2} />
        <Circle cx="-25" cy="-25" r="3" fill={accent} />
        <Circle cx="25" cy="-25" r="10" fill="none" stroke={accent} strokeWidth={2} />
        <Circle cx="25" cy="-25" r="3" fill={accent} />
        <Circle cx="-25" cy="25" r="10" fill="none" stroke={accent} strokeWidth={2} />
        <Circle cx="-25" cy="25" r="3" fill={accent} />
        <Circle cx="25" cy="25" r="10" fill="none" stroke={accent} strokeWidth={2} />
        <Circle cx="25" cy="25" r="3" fill={accent} />
      </G>
    </Svg>
  );
}
