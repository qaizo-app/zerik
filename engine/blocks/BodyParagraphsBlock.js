// Body — массив абзацев. Первый абзац опционально с drop_cap (большая буквица).
// Drop-cap пока упрощённый: первая буква стоит как обычный inline-Text, но
// крупнее и в акцентной палитре. Точная имитация HTML float:left будет позже,
// когда внедрим react-native-paper или собственный layout-хак.

import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function BodyParagraphsBlock({ paragraphs, drop_cap }) {
  const { palette, tokens } = useTheme();
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: tokens.screen.card_padding_h_text }}>
      {paragraphs.map((p, idx) => {
        const isLead = drop_cap && idx === 0;
        return (
          <View key={idx} style={{ marginBottom: 18 }}>
            {isLead ? (
              <Text style={{
                fontFamily: tokens.fonts.serif_body,
                fontSize: tokens.fontSizes.body,
                lineHeight: tokens.fontSizes.body * 1.65,
                color: palette.text
              }}>
                <Text style={{
                  fontFamily: tokens.fonts.serif_display,
                  fontSize: tokens.fontSizes.drop_cap,
                  color: palette.accent,
                  lineHeight: tokens.fontSizes.drop_cap
                }}>{p.charAt(0)}</Text>
                <InlineText
                  text={p.slice(1)}
                  style={{
                    fontFamily: tokens.fonts.serif_body,
                    fontSize: tokens.fontSizes.body,
                    color: palette.text
                  }}
                />
              </Text>
            ) : (
              <InlineText
                text={p}
                style={{
                  fontFamily: tokens.fonts.serif_body,
                  fontSize: tokens.fontSizes.body,
                  lineHeight: tokens.fontSizes.body * 1.65,
                  color: palette.text
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
