import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function MentalAccounting({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  const jars = [
    { x: 65,  label: 'RENT',    amount: '$800', fill: dim,   opacity: 0.55 },
    { x: 155, label: 'FOOD',    amount: '$200', fill: dim,   opacity: 0.45 },
    { x: 245, label: 'FUN',     amount: '$150', fill: accent, opacity: 0.8 },
    { x: 335, label: 'BONUS',   amount: '$500', fill: accent, opacity: 0.6 },
  ];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Jars */}
      {jars.map((j, i) => (
        <g key={i}>
          {/* Jar body */}
          <Path d={`M ${j.x - 25} 65 L ${j.x - 25} 130 Q ${j.x - 25} 138 ${j.x} 138 Q ${j.x + 25} 138 ${j.x + 25} 130 L ${j.x + 25} 65 Z`}
            fill={j.fill} fillOpacity={0.07} stroke={j.fill} strokeWidth={1.5} strokeOpacity={j.opacity * 0.5}
          />
          {/* Jar rim */}
          <Rect x={j.x - 28} y={58} width={56} height={12} rx="4"
            fill={j.fill} fillOpacity={0.12} stroke={j.fill} strokeWidth={1.2} strokeOpacity={j.opacity * 0.6}
          />
          {/* Coin dots inside */}
          <Circle cx={j.x}      cy={100} r="5" fill={j.fill} fillOpacity={j.opacity * 0.5} />
          <Circle cx={j.x - 10} cy={112} r="4" fill={j.fill} fillOpacity={j.opacity * 0.35} />
          <Circle cx={j.x + 10} cy={112} r="4" fill={j.fill} fillOpacity={j.opacity * 0.35} />
          {/* Labels */}
          <Text x={j.x} y={52} textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={j.fill} fillOpacity={j.opacity} fontWeight="bold">{j.label}</Text>
          <Text x={j.x} y={152} textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={j.fill} fillOpacity={j.opacity * 0.8}>{j.amount}</Text>
        </g>
      ))}

      {/* Equality sign — money is money */}
      <Text x="200" y="20" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.45}>
        $1 = $1 — but not in our minds
      </Text>
    </Svg>
  );
}
