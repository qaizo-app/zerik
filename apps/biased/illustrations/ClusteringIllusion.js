import Svg, { Circle, Line, Path, Rect, Text } from 'react-native-svg';

export default function ClusteringIllusion({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Random dots (pure noise)
  const dots = [
    [60,40],[90,65],[70,90],[55,120],[85,145],[110,55],[130,80],[120,110],
    [150,40],[170,70],[160,100],[145,130],[175,155],[200,45],[220,75],[210,105],
    [235,130],[255,50],[270,80],[260,115],[285,145],[300,55],[320,85],[310,120],
    [340,50],[360,75],[350,105],[370,135],[380,160],[95,30],[145,165],[230,165],
    [305,165],[185,30],[310,30],
  ];

  // "Imagined pattern" — a line connecting some dots that look like a trend
  const patternDots = [[60,40],[90,65],[110,55],[150,40],[200,45],[255,50],[300,55],[340,50],[370,75]];

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* All dots */}
      {dots.map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r="4" fill={mute} fillOpacity={0.3} />
      ))}

      {/* Imagined pattern line */}
      <Path d={`M ${patternDots.map(([x,y]) => `${x},${y}`).join(' L ')}`}
        fill="none" stroke={accent} strokeWidth={1.5} strokeDasharray="5,3" strokeOpacity={0.6} />

      {/* Highlight dots on pattern */}
      {patternDots.map(([cx, cy], i) => (
        <Circle key={`p${i}`} cx={cx} cy={cy} r="5" fill={accent} fillOpacity={0.6} />
      ))}

      {/* Label */}
      <Text x="200" y="172" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.45}>
        random data — pattern imposed by the brain
      </Text>
    </Svg>
  );
}
