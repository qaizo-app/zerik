// Inversion — стрелка идёт справа налево. От конца к началу.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function Inversion({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#5EEAD4';
  const accentDim = palette?.accent_dim || '#2A9D8F';
  const bgElev    = palette?.bg_elev    || '#171B21';
  const textPrim  = palette?.text       || '#E4E7EC';
  const textMute  = palette?.text_mute  || '#5C6472';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="iv_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#iv_grain)" />

      {/* старт справа */}
      <Circle cx="340" cy="90" r="14" fill="none" stroke={accent} strokeWidth={2} />
      <Circle cx="340" cy="90" r="4" fill={accent} />
      <SvgText x="340" y="135" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={accent} letterSpacing="1.5">КОНЕЦ</SvgText>

      {/* стрелка справа налево, проходящая через 3 точки-этапа */}
      <Line x1="320" y1="90" x2="80" y2="90" stroke={accent} strokeWidth={1.5} strokeDasharray="6,5" />
      <Path d="M 90 84 L 78 90 L 90 96" fill="none" stroke={accent} strokeWidth={2} strokeLinejoin="round" />

      {/* промежуточные точки */}
      <Circle cx="260" cy="90" r="6" fill={accentDim} />
      <Circle cx="200" cy="90" r="6" fill={accentDim} />
      <Circle cx="140" cy="90" r="6" fill={accentDim} />

      {/* финиш слева */}
      <Circle cx="60" cy="90" r="14" fill="none" stroke={textMute} strokeWidth={1.5} strokeDasharray="2,3" />
      <SvgText x="60" y="135" textAnchor="middle" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">НАЧАЛО</SvgText>
    </Svg>
  );
}
