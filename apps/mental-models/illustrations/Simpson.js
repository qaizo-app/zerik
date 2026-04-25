// Simpson's Paradox — общая линия идёт ВНИЗ, но три внутренние линии-сегмента
// идут ВВЕРХ. Визуализация разворота тренда при разделении на группы.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G, Text as SvgText } from 'react-native-svg';

export default function Simpson({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#6366F1';
  const accentDim = palette?.accent_dim || '#3F4AC4';
  const bgElev    = palette?.bg_elev    || '#141828';
  const textPrim  = palette?.text       || '#DEE2EE';
  const textMute  = palette?.text_mute  || '#5C6478';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="sp_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#sp_grain)" />

      {/* оси */}
      <Line x1="40" y1="150" x2="370" y2="150" stroke={textMute} strokeWidth={0.8} />
      <Line x1="40" y1="20"  x2="40"  y2="150" stroke={textMute} strokeWidth={0.8} />

      {/* три кластера точек, каждый с восходящим трендом */}
      <G>
        {/* кластер 1 — нижний слева */}
        <Circle cx="70"  cy="125" r="3" fill={accent} />
        <Circle cx="100" cy="115" r="3" fill={accent} />
        <Circle cx="130" cy="105" r="3" fill={accent} />
        <Path d="M 70 125 L 130 105" stroke={accent} strokeWidth={1.5} />

        {/* кластер 2 — средний */}
        <Circle cx="170" cy="100" r="3" fill={accent} />
        <Circle cx="200" cy="90"  r="3" fill={accent} />
        <Circle cx="230" cy="80"  r="3" fill={accent} />
        <Path d="M 170 100 L 230 80" stroke={accent} strokeWidth={1.5} />

        {/* кластер 3 — верхний справа */}
        <Circle cx="270" cy="75" r="3" fill={accent} />
        <Circle cx="300" cy="65" r="3" fill={accent} />
        <Circle cx="330" cy="55" r="3" fill={accent} />
        <Path d="M 270 75 L 330 55" stroke={accent} strokeWidth={1.5} />
      </G>

      {/* общий тренд — ВНИЗ через все три кластера (парадокс) */}
      <Path
        d="M 70 90 L 330 95"
        stroke={textMute} strokeWidth={2} strokeDasharray="5,5"
      />
      <SvgText x="80" y="80" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={textMute} letterSpacing="1.5">ОБЩИЙ ТРЕНД ↓</SvgText>
      <SvgText x="220" y="40" fontFamily="JetBrainsMono-Regular" fontSize="9" fill={accent} letterSpacing="1.5">ВНУТРИ ГРУПП ↑</SvgText>
    </Svg>
  );
}
