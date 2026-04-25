import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v'];

export default function DomainsBlock({ heading, items }) {
  const { palette, tokens } = useTheme();

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 4, marginTop: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <View style={{ width: 12, height: 1, backgroundColor: palette.text_mute, marginRight: 8 }} />
        <Text style={{
          fontFamily: tokens.fonts.mono_medium,
          fontSize: 10,
          letterSpacing: 2.8,
          color: palette.text_mute,
          textTransform: 'uppercase'
        }}>{heading}</Text>
      </View>

      {items.map((it, idx) => (
        <View key={idx} style={{
          flexDirection: 'row',
          gap: 16,
          paddingVertical: 16,
          borderBottomWidth: idx < items.length - 1 ? 1 : 0,
          borderBottomColor: palette.border
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: palette.border_bright,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontFamily: tokens.fonts.serif_italic,
              fontStyle: 'italic',
              fontSize: 14,
              color: palette.accent
            }}>{ROMAN[idx] || idx + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: tokens.fonts.serif_display,
              fontSize: 16,
              color: palette.text,
              marginBottom: 4
            }}>{it.label}</Text>
            <Text style={{
              fontFamily: tokens.fonts.serif_italic,
              fontStyle: 'italic',
              fontSize: 14.5,
              lineHeight: 14.5 * 1.55,
              color: palette.text_dim
            }}>{it.example}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
