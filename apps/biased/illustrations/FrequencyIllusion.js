import Svg, { Circle, Rect, Text, Path } from 'react-native-svg';

export default function FrequencyIllusion({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  // Random dot field
  const dots = [
    [55,30],[80,55],[110,25],[135,60],[165,40],[190,70],[220,30],[245,50],
    [270,38],[300,65],[330,42],[360,58],[70,85],[95,105],[120,90],[150,112],
    [180,100],[210,118],[235,88],[260,108],[290,95],[320,115],[350,88],[380,105],
    [50,135],[78,155],[105,140],[132,160],[158,135],[185,155],[212,142],[238,158],
    [265,138],[290,160],[315,145],[345,162],[370,140],
  ];

  // Some dots are "the thing" — highlighted with accent
  const targetIdx = new Set([2, 7, 12, 19, 26, 31, 35]);

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Spotlight / scan circle effect */}
      <Circle cx="200" cy="90" r="90" fill={accent} fillOpacity={0.04} />

      {dots.map(([cx, cy], i) => (
        targetIdx.has(i)
          ? <Circle key={i} cx={cx} cy={cy} r="6" fill={accent} fillOpacity={0.85} />
          : <Circle key={i} cx={cx} cy={cy} r="3" fill={mute} fillOpacity={0.2} />
      ))}

      {/* Label at bottom */}
      <Text x="200" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={mute} fillOpacity={0.5}>
        once noticed, it appears everywhere
      </Text>
    </Svg>
  );
}
