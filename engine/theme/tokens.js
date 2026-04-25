// Базовые дизайн-токены движка. Импортируются из shared design/design_tokens.json
// чтобы дизайнер мог редактировать токены без правки JS.

import raw from '@design/design_tokens.json';

export const tokens = {
  fonts: {
    serif_display: 'Prata-Regular',
    serif_body:    'Spectral-Regular',
    serif_italic:  'Spectral-Italic',
    serif_light:   'Spectral-Light',
    serif_medium:  'Spectral-Medium',
    mono:          'JetBrainsMono-Regular',
    mono_medium:   'JetBrainsMono-Medium',
    mono_bold:     'JetBrainsMono-Bold'
  },
  fontSizes:     raw.fontSizes,
  lineHeight:    raw.lineHeight,
  letterSpacing: raw.letterSpacing,
  spacing:       raw.spacing,
  radius:        raw.radius,
  border:        raw.border,
  screen:        raw.screen,
  animation:     raw.animation
};

export default tokens;
