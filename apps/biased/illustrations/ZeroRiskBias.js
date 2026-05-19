import Svg, { Line, Rect, Text, Path } from 'react-native-svg';

export default function ZeroRiskBias({ palette = {}, width = '100%', height = 180 }) {
  const accent = palette.accent  || '#F5A623';
  const bg     = palette.bg_elev || '#0F1E30';
  const dim    = palette.text    || '#B0C8DF';
  const mute   = palette.text_mute || '#4A6480';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Rect width="400" height="180" fill={bg} />

      {/* OPTION A: Eliminate small risk entirely */}
      <Text x="110" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={accent} fillOpacity={0.9}>Option A</Text>
      <Text x="110" y="35" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.6}>eliminate small risk</Text>

      {/* Before bar A — small risk */}
      <Rect x="60" y="50" width="18" height="45" rx="3" fill={accent} fillOpacity={0.5} />
      <Text x="69" y="48" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.5}>5%</Text>
      {/* After bar A — zero */}
      <Rect x="142" y="92" width="18" height="3" rx="1" fill={mute} fillOpacity={0.2} />
      <Text x="151" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.4}>0%</Text>

      {/* Arrow */}
      <Path d="M 82 72 L 138 72" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.5} />
      <Path d="M 134 68 L 141 72 L 134 76" fill={accent} fillOpacity={0.5} />
      <Text x="110" y="66" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={accent} fillOpacity={0.6}>−5%</Text>

      {/* OPTION B: Reduce big risk */}
      <Text x="290" y="22" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fill={dim} fillOpacity={0.7}>Option B</Text>
      <Text x="290" y="35" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5}>reduce large risk</Text>

      {/* Before bar B — large risk */}
      <Rect x="240" y="50" width="18" height="90" rx="3" fill={dim} fillOpacity={0.25} />
      <Text x="249" y="48" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.5}>50%</Text>
      {/* After bar B — reduced */}
      <Rect x="322" y="75" width="18" height="65" rx="3" fill={dim} fillOpacity={0.2} />
      <Text x="331" y="73" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={mute} fillOpacity={0.4}>35%</Text>

      {/* Arrow */}
      <Path d="M 262 80 L 318 80" fill="none" stroke={dim} strokeWidth={1.5} strokeOpacity={0.4} />
      <Path d="M 314 76 L 321 80 L 314 84" fill={dim} fillOpacity={0.4} />
      <Text x="290" y="74" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill={dim} fillOpacity={0.5}>−15%</Text>

      {/* Preference marker on A */}
      <Path d="M 100 148 L 100 140 L 122 140 L 122 148" fill="none" stroke={accent} strokeWidth={1.5} strokeOpacity={0.7} />
      <Text x="110" y="162" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={accent} fillOpacity={0.8}>preferred</Text>

      {/* Better choice marker on B */}
      <Text x="290" y="155" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill={mute} fillOpacity={0.5}>3× more impact</Text>

      {/* Divider */}
      <Line x1="200" y1="15" x2="200" y2="165" stroke={mute} strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.2} />
    </Svg>
  );
}
