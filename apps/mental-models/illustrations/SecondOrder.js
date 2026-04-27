// SecondOrder — каскад домино или волны. Первое действие → второе → третье.
// Третий порядок последствий важнее первого.

import Svg, { Defs, Pattern, Circle, Rect, Line } from 'react-native-svg';

export default function SecondOrder({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#E89647';
  const accentDim = palette?.accent_dim || '#A86E35';
  const bgElev    = palette?.bg_elev    || '#1E1812';
  const textPrim  = palette?.text       || '#EBDFCC';
  const textMute  = palette?.text_mute  || '#6B6258';

  // 5 домино — первое падает, остальные ещё стоят, но наклон растёт
  const dominoes = [
    { x: 80,  rotate: -45 },
    { x: 130, rotate: -25 },
    { x: 180, rotate: -10 },
    { x: 230, rotate: -5  },
    { x: 280, rotate: 0   },
    { x: 330, rotate: 0   }
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="so_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#so_grain)" />

      {/* пол */}
      <Line x1="40" y1="140" x2="360" y2="140" stroke={textMute} strokeWidth={0.8} />

      {/* домино */}
      {dominoes.map((d, i) => {
        const isFirst = i === 0;
        const color = isFirst ? accent : (i === 1 ? accentDim : textMute);
        return (
          <Rect
            key={i}
            x={d.x - 6}
            y={80}
            width={12}
            height={60}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            transform={`rotate(${d.rotate} ${d.x} 140)`}
          />
        );
      })}

      {/* акцентный круг "толчок" */}
      <Circle cx="50" cy="120" r="5" fill={accent} />
      <Circle cx="50" cy="120" r="10" fill="none" stroke={accent} strokeWidth={0.8} opacity={0.5} />
    </Svg>
  );
}
