import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function ScenarioBlock({ tag, question, setup, options, reveal, card, dynamic }) {
  const { palette, tokens } = useTheme();
  const [picked, setPicked] = useState(null);
  const revealed = picked !== null;

  const stats = reveal?.hardcoded_stats || dynamic?.scenarioStats?.[card?.id] || null;
  const totalVotes = stats?.total_votes || dynamic?.votesCount;

  function pct(optId) {
    if (!stats?.options?.[optId]) return null;
    const c = stats.options[optId].count || 0;
    const t = stats.total_votes || 1;
    return Math.round((c / t) * 100);
  }

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
          fontFamily: tokens.fonts.mono,
          fontSize: 9,
          letterSpacing: 2.25,
          color: palette.accent,
          textTransform: 'uppercase'
        }}>{tag}</Text>
      </View>

      <Text style={{
        fontFamily: tokens.fonts.serif_display,
        fontSize: tokens.fontSizes.scenario_q,
        lineHeight: tokens.fontSizes.scenario_q * 1.3,
        color: palette.text,
        marginBottom: setup ? 12 : 20
      }}>{question}</Text>

      {setup ? (
        <Text style={{
          fontFamily: tokens.fonts.serif_italic,
          fontSize: 14.5,
          lineHeight: 14.5 * 1.55,
          color: palette.text_dim,
          fontStyle: 'italic',
          marginBottom: 20,
          paddingLeft: 12,
          borderLeftWidth: 1,
          borderLeftColor: palette.border_bright
        }}>{setup}</Text>
      ) : null}

      <View style={{ gap: 10 }}>
        {options.map(opt => {
          const isPicked = picked === opt.id;
          const isWiser  = revealed && opt.is_wiser;
          const borderColor = isPicked
            ? palette.picked
            : isWiser
              ? palette.wiser
              : palette.border_bright;
          const bgColor = isPicked
            ? 'rgba(196, 97, 79, 0.08)'
            : isWiser
              ? 'rgba(94, 234, 212, 0.06)'
              : 'transparent';

          return (
            <Pressable
              key={opt.id}
              disabled={revealed}
              onPress={() => setPicked(opt.id)}
              style={{
                borderWidth: 1,
                borderColor,
                backgroundColor: bgColor,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: tokens.radius.tight,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Text style={{
                fontFamily: tokens.fonts.serif_body,
                fontSize: 15.5,
                color: palette.text,
                flex: 1
              }}>{opt.text}</Text>
              {revealed && pct(opt.id) != null ? (
                <Text style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: 12,
                  color: isWiser ? palette.wiser : palette.accent,
                  marginLeft: 12
                }}>{pct(opt.id)}%</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {revealed && reveal ? (
        <View style={{
          marginTop: 22,
          paddingTop: 22,
          borderTopWidth: 1,
          borderTopColor: palette.border_bright
        }}>
          {reveal.source_note ? (
            <Text style={{
              fontFamily: tokens.fonts.mono,
              fontSize: 10,
              letterSpacing: 1.5,
              color: palette.text_mute,
              textTransform: 'uppercase',
              marginBottom: 10
            }}>
              <InlineText
                text={reveal.source_note}
                style={{ color: palette.text_mute }}
                dynamic={{ votesCount: totalVotes }}
              />
            </Text>
          ) : null}

          {reveal.big_stat_text ? (
            <Text style={{
              fontFamily: tokens.fonts.serif_display,
              fontSize: tokens.fontSizes.stat_big,
              lineHeight: tokens.fontSizes.stat_big,
              color: palette.accent,
              marginBottom: 10
            }}>
              {(() => {
                const wiserOpt = options.find(o => o.is_wiser);
                const wiserPct = wiserOpt ? pct(wiserOpt.id) : null;
                return wiserPct != null ? `${wiserPct}% ` : '';
              })()}
              <Text style={{ fontStyle: 'italic', fontFamily: tokens.fonts.serif_display }}>
                {reveal.big_stat_text}
              </Text>
            </Text>
          ) : null}

          <InlineText
            text={reveal.explanation}
            style={{
              fontFamily: tokens.fonts.serif_body,
              fontSize: 15.5,
              lineHeight: 15.5 * 1.6,
              color: palette.text,
              marginBottom: 14
            }}
          />

          {reveal.wisdom ? (
            <InlineText
              text={reveal.wisdom}
              style={{
                fontFamily: tokens.fonts.serif_italic,
                fontSize: 14.5,
                lineHeight: 14.5 * 1.55,
                color: palette.text_dim,
                fontStyle: 'italic'
              }}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
