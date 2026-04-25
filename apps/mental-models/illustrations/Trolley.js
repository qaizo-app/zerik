// Trolley Problem — рельсы развилки. Сверху 5 фигур, снизу 1.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, G } from 'react-native-svg';

export default function Trolley({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#A78BFA';
  const accentDim = palette?.accent_dim || '#7C5FE0';
  const bgElev    = palette?.bg_elev    || '#1A1424';
  const textPrim  = palette?.text       || '#E8E2F0';
  const textMute  = palette?.text_mute  || '#6B6478';

  function person(cx, cy, color, size = 1) {
    return (
      <G stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round">
        <Circle cx={cx} cy={cy - 8 * size} r={3 * size} />
        <Line x1={cx} y1={cy - 5 * size} x2={cx} y2={cy + 6 * size} />
        <Line x1={cx} y1={cy - 2 * size} x2={cx - 5 * size} y2={cy + 2 * size} />
        <Line x1={cx} y1={cy - 2 * size} x2={cx + 5 * size} y2={cy + 2 * size} />
        <Line x1={cx} y1={cy + 6 * size} x2={cx - 4 * size} y2={cy + 12 * size} />
        <Line x1={cx} y1={cy + 6 * size} x2={cx + 4 * size} y2={cy + 12 * size} />
      </G>
    );
  }

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="tr_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#tr_grain)" />

      {/* развилка рельсов */}
      <G stroke={textMute} strokeWidth={1.4} fill="none">
        {/* основной путь */}
        <Line x1="40" y1="90" x2="160" y2="90" />
        {/* верхняя ветка к 5 */}
        <Path d="M 160 90 Q 200 90 220 60 L 360 60" />
        {/* нижняя ветка к 1 */}
        <Path d="M 160 90 Q 200 90 220 130 L 360 130" />
        {/* шпалы */}
        <Line x1="60" y1="84" x2="60" y2="96" />
        <Line x1="100" y1="84" x2="100" y2="96" />
        <Line x1="140" y1="84" x2="140" y2="96" />
      </G>

      {/* развилка-стрелка (рычаг) */}
      <G transform="translate(160, 90)">
        <Circle cx="0" cy="0" r="6" fill={accent} />
        <Line x1="0" y1="0" x2="14" y2="-14" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
      </G>

      {/* пять человек на верхней ветке */}
      {person(260, 60, accent)}
      {person(280, 60, accent)}
      {person(300, 60, accent)}
      {person(320, 60, accent)}
      {person(340, 60, accent)}

      {/* один человек на нижней ветке */}
      {person(300, 130, accent)}

      {/* "вагонетка" слева — простой прямоугольник на колёсах */}
      <G transform="translate(40, 80)">
        <Rect x="0" y="0" width="30" height="14" fill="none" stroke={accent} strokeWidth={1.5} />
        <Circle cx="6" cy="16" r="3" fill={accent} />
        <Circle cx="24" cy="16" r="3" fill={accent} />
      </G>
    </Svg>
  );
}
