// Блок академической статистики. Используется в Thought Experiments / Psych
// Experiments для отображения готовых данных без cold start (Moral Machine,
// Ultimatum Game и т.п.).

import { View, Text } from 'react-native';
import { useTheme } from '@engine';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(0) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

export default function HistoricalDataBlock({
  label,
  source,
  sample_size,
  year,
  breakdown,
  regional_split
}) {
  const { palette, tokens } = useTheme();

  return (
    <View style={{
      marginVertical: 24,
      marginHorizontal: 24,
      paddingVertical: 22,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: palette.border_bright,
      borderRadius: tokens.radius.tight,
      backgroundColor: palette.bg_card
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono, fontSize: 9.5, letterSpacing: 2.4,
        color: palette.accent, textTransform: 'uppercase', marginBottom: 10
      }}>{label || 'Statistics'}</Text>

      <Text style={{
        fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 1.4,
        color: palette.text_mute, textTransform: 'uppercase', marginBottom: 18
      }}>
        {source}{year ? ` · ${year}` : ''}{sample_size ? ` · n=${formatNumber(sample_size)}` : ''}
      </Text>

      {Array.isArray(breakdown) && breakdown.map((item, idx) => (
        <View key={idx} style={{ marginBottom: 14 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 4
          }}>
            <Text style={{
              flex: 1,
              fontFamily: tokens.fonts.serif_body,
              fontSize: 14.5,
              color: palette.text,
              paddingRight: 12
            }}>{item.label}</Text>
            <Text style={{
              fontFamily: tokens.fonts.serif_display,
              fontSize: 22,
              color: item.is_majority ? palette.accent : palette.text_dim
            }}>{item.percentage}%</Text>
          </View>
          <View style={{
            height: 3,
            backgroundColor: palette.border,
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <View style={{
              height: '100%',
              width: `${Math.min(100, item.percentage)}%`,
              backgroundColor: item.is_majority ? palette.accent : palette.accent_dim
            }} />
          </View>
        </View>
      ))}

      {Array.isArray(regional_split) && regional_split.length > 0 ? (
        <View style={{ marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: palette.border }}>
          <Text style={{
            fontFamily: tokens.fonts.mono, fontSize: 9, letterSpacing: 2,
            color: palette.text_mute, textTransform: 'uppercase', marginBottom: 10
          }}>By region</Text>
          {regional_split.map((r, idx) => (
            <View key={idx} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 4
            }}>
              <Text style={{
                fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
                fontSize: 13, color: palette.text_dim, flex: 1, paddingRight: 8
              }}>{r.region}</Text>
              <Text style={{
                fontFamily: tokens.fonts.mono_medium, fontSize: 12,
                color: palette.accent
              }}>{r.percentage}%</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
