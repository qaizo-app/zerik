// Рендерит inline-сегменты как Text с правильными стилями.
// Используется внутри блоков, в которых текст содержит {{accent:...}} / {{em:...}}.

import { Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { parseInline, fillDynamic } from './inlineMarkers';

export default function InlineText({
  text,
  style,
  accentStyle,
  emStyle,
  dynamic
}) {
  const { palette, tokens } = useTheme();
  const segments = fillDynamic(parseInline(text), dynamic);

  return (
    <Text style={style}>
      {segments.map((seg, i) => {
        if (seg.kind === 'accent') {
          return (
            <Text key={i} style={[
              { color: palette.accent, fontStyle: 'italic', fontFamily: tokens.fonts.serif_italic },
              accentStyle
            ]}>
              {seg.text}
            </Text>
          );
        }
        if (seg.kind === 'em') {
          return (
            <Text key={i} style={[
              { fontStyle: 'italic', fontFamily: tokens.fonts.serif_italic },
              emStyle
            ]}>
              {seg.text}
            </Text>
          );
        }
        return <Text key={i}>{seg.text}</Text>;
      })}
    </Text>
  );
}
