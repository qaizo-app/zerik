// Руль не подключён к колёсам: ощущение контроля без причинной связи.

import Svg, { Defs, Pattern, Circle, Rect, Path, Line } from 'react-native-svg';

export default function IllusionOfControl({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="ic_g" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={dim} fillOpacity={0.06} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bg} />
      <Rect width="400" height="180" fill="url(#ic_g)" />

      {/* steering wheel */}
      <Circle cx="120" cy="90" r="40" fill="none" stroke={accent} strokeWidth={2.5} />
      <Circle cx="120" cy="90" r="6" fill={accent} />
      <Line x1="120" y1="50" x2="120" y2="84" stroke={accent} strokeWidth={2} />
      <Line x1="80"  y1="90" x2="114" y2="90" stroke={accent} strokeWidth={2} />
      <Line x1="120" y1="96" x2="120" y2="130" stroke={accent} strokeWidth={2} />
      <Line x1="126" y1="90" x2="160" y2="90" stroke={accent} strokeWidth={2} />

      {/* disconnect — gap with sparks/dashes */}
      <Line x1="170" y1="90" x2="220" y2="90" stroke={mute} strokeWidth={1.2} strokeDasharray="2,4" />
      <Path d="M 195 80 L 200 95 L 198 90 L 205 95" fill="none" stroke={accent} strokeWidth={1.4} strokeOpacity={0.7} />

      {/* the "actual mechanism" — a wheel/cog drifting on its own */}
      <Circle cx="290" cy="90" r="22" fill="none" stroke={mute} strokeWidth={1.8} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 290 + Math.cos(rad) * 22;
        const y1 = 90  + Math.sin(rad) * 22;
        const x2 = 290 + Math.cos(rad) * 28;
        const y2 = 90  + Math.sin(rad) * 28;
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mute} strokeWidth={1.5} />;
      })}
      <Circle cx="290" cy="90" r="4" fill={mute} />
    </Svg>
  );
}
