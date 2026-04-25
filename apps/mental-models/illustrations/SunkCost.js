// Sunk Cost Fallacy — золотые монеты каскадом исчезают в чёрной яме слева,
// справа стопка монет ждёт следующего броска. Без человеческой руки —
// абстрактная метафора, которая на маленьком экране читается яснее.

import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Pattern,
  Circle,
  Rect,
  Ellipse,
  Path,
  G,
  Line
} from 'react-native-svg';

export default function SunkCost({ palette, width = '100%', height = 180 }) {
  const accent     = palette?.accent     || '#E89647';
  const accentDim  = palette?.accent_dim || '#A86E35';
  const bgElev     = palette?.bg_elev    || '#1E1812';
  const bg         = palette?.bg         || '#14100C';
  const textPrim   = palette?.text       || '#EBDFCC';
  const textMute   = palette?.text_mute  || '#6B6258';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <LinearGradient id="sc_gold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={accent} />
          <Stop offset="100%" stopColor={accentDim} />
        </LinearGradient>
        <Pattern id="sc_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.08} />
        </Pattern>
      </Defs>

      {/* фон */}
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#sc_grain)" />

      {/* левая часть — яма с уходящими монетами */}
      <G>
        {/* провал */}
        <Ellipse cx="140" cy="148" rx="100" ry="20" fill={bg} />
        <Ellipse cx="140" cy="146" rx="84"  ry="14" fill="#0A0806" />

        {/* каскад монет — крупная сверху, дальше уменьшаются и теряют непрозрачность */}
        <Ellipse cx="118" cy="40"  rx="20" ry="6"   fill="url(#sc_gold)" opacity={0.95} />
        <Ellipse cx="135" cy="68"  rx="17" ry="5"   fill="url(#sc_gold)" opacity={0.8} />
        <Ellipse cx="125" cy="92"  rx="14" ry="4"   fill="url(#sc_gold)" opacity={0.62} />
        <Ellipse cx="148" cy="115" rx="11" ry="3.2" fill="url(#sc_gold)" opacity={0.45} />
        <Ellipse cx="135" cy="135" rx="9"  ry="2.6" fill="url(#sc_gold)" opacity={0.25} />

        {/* пунктирная траектория падения */}
        <Path
          d="M 118 46 Q 130 80 135 110 T 138 142"
          fill="none" stroke={textMute} strokeWidth={1} strokeDasharray="2,4" opacity={0.5}
        />
      </G>

      {/* разделитель */}
      <Line x1="260" y1="40" x2="260" y2="160" stroke={accentDim} strokeWidth={0.5} opacity={0.35} />

      {/* правая часть — стопка монет ждущих "броска" */}
      <G transform="translate(320, 110)">
        {/* стопка от низа к верху */}
        <Ellipse cx="0" cy="40" rx="32" ry="9" fill={accentDim} opacity={0.6} />
        <Ellipse cx="0" cy="32" rx="32" ry="9" fill="url(#sc_gold)" />
        <Ellipse cx="0" cy="24" rx="32" ry="9" fill="url(#sc_gold)" />
        <Ellipse cx="0" cy="16" rx="32" ry="9" fill="url(#sc_gold)" />
        <Ellipse cx="0" cy="8"  rx="32" ry="9" fill="url(#sc_gold)" />
        <Ellipse cx="0" cy="0"  rx="32" ry="9" fill="url(#sc_gold)" />
        <Ellipse cx="0" cy="0"  rx="32" ry="9" fill="none" stroke={textPrim} strokeWidth={0.5} strokeOpacity={0.3} />
      </G>

      {/* стрелка от стопки к яме — намёк "продолжаем кидать" */}
      <Path
        d="M 280 110 Q 230 70 175 70"
        fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="3,4" opacity={0.6}
      />
      <Path d="M 175 70 L 182 65 M 175 70 L 182 76" stroke={accent} strokeWidth={1.2} fill="none" opacity={0.6} />
    </Svg>
  );
}
