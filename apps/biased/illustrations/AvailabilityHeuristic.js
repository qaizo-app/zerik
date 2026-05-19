import Svg, { Circle, Ellipse, Line, Rect } from 'react-native-svg';

export default function AvailabilityHeuristic({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* Brain outline */}
      <Ellipse cx="200" cy="95" rx="72" ry="60" fill="none" stroke={mute} strokeWidth={1.5} strokeOpacity={0.4} />

      {/* Vivid / easy-to-recall thoughts — bright & large */}
      <Circle cx="200" cy="55"  r="14" fill={accent} fillOpacity={0.9} />
      <Circle cx="155" cy="80"  r="11" fill={accent} fillOpacity={0.75} />
      <Circle cx="245" cy="80"  r="11" fill={accent} fillOpacity={0.75} />
      <Circle cx="200" cy="108" r="9"  fill={accent} fillOpacity={0.6} />

      {/* Hard-to-recall thoughts — tiny & dim */}
      <Circle cx="130" cy="100" r="3" fill={dim} fillOpacity={0.25} />
      <Circle cx="272" cy="100" r="3" fill={dim} fillOpacity={0.25} />
      <Circle cx="148" cy="125" r="2.5" fill={dim} fillOpacity={0.2} />
      <Circle cx="252" cy="125" r="2.5" fill={dim} fillOpacity={0.2} />
      <Circle cx="185" cy="138" r="2" fill={dim} fillOpacity={0.15} />
      <Circle cx="218" cy="140" r="2" fill={dim} fillOpacity={0.15} />
      <Circle cx="163" cy="60"  r="2" fill={dim} fillOpacity={0.2} />
      <Circle cx="237" cy="60"  r="2" fill={dim} fillOpacity={0.2} />

      {/* Lines from brain to vivid dots */}
      <Line x1="200" y1="35" x2="200" y2="55"  stroke={accent} strokeWidth={1} strokeOpacity={0.5} />
      <Line x1="168" y1="75" x2="155" y2="80"  stroke={accent} strokeWidth={1} strokeOpacity={0.5} />
      <Line x1="232" y1="75" x2="245" y2="80"  stroke={accent} strokeWidth={1} strokeOpacity={0.5} />
    </Svg>
  );
}
