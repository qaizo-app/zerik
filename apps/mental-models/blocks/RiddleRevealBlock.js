// Загадка с раскрытием. Используется в Paradoxes — пользователь видит вопрос,
// тапает «открыть разгадку», получает ответ + объяснение интуиции.
// В отличие от scenario_block — без вариантов голосования.

import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, InlineText } from '@engine';

export default function RiddleRevealBlock({
  tag,
  question,
  hint,
  user_prompt,
  reveal_text,
  formula,
  intuition_trap
}) {
  const { palette, tokens } = useTheme();
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={{
      marginTop: 36,
      marginHorizontal: 20,
      marginBottom: 28,
      borderWidth: 1,
      borderColor: palette.border_bright,
      borderRadius: tokens.radius.tight,
      paddingVertical: 24,
      paddingHorizontal: 22,
      backgroundColor: palette.bg_card
    }}>
      {tag ? (
        <View style={{
          alignSelf: 'flex-start',
          borderWidth: 1,
          borderColor: palette.accent_dim,
          borderRadius: tokens.radius.tight,
          paddingVertical: 4,
          paddingHorizontal: 8,
          marginBottom: 16
        }}>
          <Text style={{
            fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 2.25,
            color: palette.accent, textTransform: 'uppercase'
          }}>{tag}</Text>
        </View>
      ) : null}

      <Text style={{
        fontFamily: tokens.fonts.serif_display,
        fontSize: tokens.fontSizes.scenario_q,
        lineHeight: tokens.fontSizes.scenario_q * 1.3,
        color: palette.text,
        marginBottom: hint ? 12 : 20
      }}>{question}</Text>

      {hint && !revealed ? (
        <Text style={{
          fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
          fontSize: 14.5, lineHeight: 14.5 * 1.55,
          color: palette.text_dim,
          paddingLeft: 12,
          borderLeftWidth: 1,
          borderLeftColor: palette.border_bright,
          marginBottom: 20
        }}>{hint}</Text>
      ) : null}

      {!revealed ? (
        <Pressable
          onPress={() => setRevealed(true)}
          style={{
            borderWidth: 1,
            borderColor: palette.accent,
            borderRadius: tokens.radius.tight,
            paddingVertical: 14,
            paddingHorizontal: 16,
            alignItems: 'center'
          }}
        >
          <Text style={{
            fontFamily: tokens.fonts.mono_medium, fontSize: 11, letterSpacing: 2,
            color: palette.accent, textTransform: 'uppercase'
          }}>{user_prompt || 'Reveal'}</Text>
        </Pressable>
      ) : (
        <View style={{
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: palette.border_bright
        }}>
          <InlineText
            text={reveal_text}
            style={{
              fontFamily: tokens.fonts.serif_body,
              fontSize: 15.5,
              lineHeight: 15.5 * 1.6,
              color: palette.text,
              marginTop: 16,
              marginBottom: formula ? 14 : 0
            }}
          />

          {formula ? (
            <View style={{
              marginVertical: 10,
              paddingVertical: 12,
              paddingHorizontal: 14,
              backgroundColor: palette.bg_elev,
              borderLeftWidth: 2,
              borderLeftColor: palette.accent,
              borderRadius: tokens.radius.tight
            }}>
              <Text style={{
                fontFamily: tokens.fonts.mono, fontSize: 13, lineHeight: 18,
                color: palette.text
              }}>{formula}</Text>
            </View>
          ) : null}

          {intuition_trap ? (
            <View style={{ marginTop: 16 }}>
              <Text style={{
                fontFamily: tokens.fonts.mono, fontSize: 9.5, letterSpacing: 2,
                color: palette.text_mute, textTransform: 'uppercase', marginBottom: 6
              }}>Почему интуиция обманывает</Text>
              <InlineText
                text={intuition_trap}
                style={{
                  fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
                  fontSize: 14.5, lineHeight: 14.5 * 1.55,
                  color: palette.text_dim
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
