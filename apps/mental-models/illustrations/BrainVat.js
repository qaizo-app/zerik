// BrainVat — мозг в банке с проводами в "симулированный мир".
// Декартова метафора: можем ли мы знать что наша реальность реальна?

import Svg, { Defs, Pattern, Circle, Rect, Path, Line, Ellipse } from 'react-native-svg';

export default function BrainVat({ palette, width = '100%', height = 180 }) {
  const accent    = palette?.accent     || '#A78BFA';
  const accentDim = palette?.accent_dim || '#7C5FE0';
  const bgElev    = palette?.bg_elev    || '#1A1424';
  const textPrim  = palette?.text       || '#E8E2F0';
  const textMute  = palette?.text_mute  || '#6B6478';

  return (
    <Svg viewBox="0 0 400 180" width={width} height={height}>
      <Defs>
        <Pattern id="bv_grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="0.3" fill={textPrim} fillOpacity={0.07} />
        </Pattern>
      </Defs>
      <Rect width="400" height="180" fill={bgElev} />
      <Rect width="400" height="180" fill="url(#bv_grain)" />

      {/* банка */}
      <Path
        d="M 160 60 L 160 140 Q 160 155 175 155 L 225 155 Q 240 155 240 140 L 240 60 Z"
        fill="none" stroke={textMute} strokeWidth={1.8}
      />
      {/* горлышко банки */}
      <Rect x="170" y="50" width="60" height="14" fill="none" stroke={textMute} strokeWidth={1.5} />
      {/* жидкость */}
      <Path
        d="M 162 95 L 238 95 L 238 140 Q 238 153 225 153 L 175 153 Q 162 153 162 140 Z"
        fill={accentDim} fillOpacity={0.15}
      />
      {/* поверхность жидкости (волна) */}
      <Path d="M 162 95 Q 175 92 190 95 Q 210 98 225 95 Q 238 92 238 95" stroke={accent} strokeWidth={0.8} fill="none" />

      {/* мозг (стилизованные доли) */}
      <Path
        d="M 175 110 Q 178 100 188 102 Q 195 96 205 100 Q 215 96 220 105 Q 226 110 222 120 Q 224 128 215 130 Q 205 134 195 130 Q 185 132 178 125 Q 172 118 175 110 Z"
        fill="none" stroke={accent} strokeWidth={1.5}
      />
      {/* складка мозга */}
      <Path d="M 200 105 Q 198 115 200 125" stroke={accent} strokeWidth={0.8} fill="none" />
      <Path d="M 188 110 Q 192 118 188 125" stroke={accent} strokeWidth={0.8} fill="none" />
      <Path d="M 212 110 Q 208 118 212 125" stroke={accent} strokeWidth={0.8} fill="none" />

      {/* провода/электроды наверх к "симулятору" */}
      <Line x1="185" y1="50" x2="185" y2="30" stroke={accent} strokeWidth={1} />
      <Line x1="200" y1="50" x2="200" y2="22" stroke={accent} strokeWidth={1} />
      <Line x1="215" y1="50" x2="215" y2="30" stroke={accent} strokeWidth={1} />
      <Circle cx="185" cy="28" r="2" fill={accent} />
      <Circle cx="200" cy="20" r="2" fill={accent} />
      <Circle cx="215" cy="28" r="2" fill={accent} />

      {/* "сигнал реальности" — пунктирные линии вокруг */}
      <Path d="M 70 100 Q 50 90 30 100" fill="none" stroke={textMute} strokeWidth={0.8} strokeDasharray="3,4" opacity={0.5} />
      <Path d="M 330 100 Q 350 90 370 100" fill="none" stroke={textMute} strokeWidth={0.8} strokeDasharray="3,4" opacity={0.5} />
    </Svg>
  );
}
