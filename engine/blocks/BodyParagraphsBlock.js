// Body — массив абзацев. Первый абзац опционально с drop_cap (большая буквица).
//
// Layout drop-cap: flexDirection row — буквица слева в фиксированной колонке,
// текст справа во flex-области. Это не идеальное HTML float:left обтекание
// (текст не идёт под буквицу когда она кончается), но визуально близко и
// реализуется без хаков с измерением высоты в RN.

import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

const DROP_CAP_COLUMN_WIDTH = 56;  // ширина колонки буквицы

export default function BodyParagraphsBlock({ paragraphs, drop_cap }) {
  const { palette, tokens } = useTheme();
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: tokens.screen.card_padding_h_text }}>
      {paragraphs.map((p, idx) => {
        const isLead = drop_cap && idx === 0;

        if (isLead) {
          const firstLetter = p.charAt(0);
          const rest = p.slice(1);
          return (
            <View key={idx} style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 18
            }}>
              <View style={{ width: DROP_CAP_COLUMN_WIDTH, alignItems: 'flex-start', paddingTop: 6 }}>
                <Text style={{
                  fontFamily: tokens.fonts.serif_display,
                  fontSize: tokens.fontSizes.drop_cap,
                  lineHeight: tokens.fontSizes.drop_cap * 1.05,
                  color: palette.accent,
                  includeFontPadding: false
                }}>{firstLetter}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <InlineText
                  text={rest}
                  style={{
                    fontFamily: tokens.fonts.serif_body,
                    fontSize: tokens.fontSizes.body,
                    lineHeight: tokens.fontSizes.body * 1.55,
                    color: palette.text
                  }}
                />
              </View>
            </View>
          );
        }

        return (
          <View key={idx} style={{ marginBottom: 18 }}>
            <InlineText
              text={p}
              style={{
                fontFamily: tokens.fonts.serif_body,
                fontSize: tokens.fontSizes.body,
                lineHeight: tokens.fontSizes.body * 1.65,
                color: palette.text
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
