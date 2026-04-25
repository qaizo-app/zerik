import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function PrincipleBlock({ label, text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      marginVertical: 24,
      marginHorizontal: 24,
      paddingVertical: 26,
      paddingHorizontal: 24,
      borderLeftWidth: 2,
      borderLeftColor: palette.accent,
      backgroundColor: palette.bg_elev
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 9.5,
        letterSpacing: 2.4,
        color: palette.accent,
        textTransform: 'uppercase',
        marginBottom: 10
      }}>{label}</Text>
      <InlineText
        text={text}
        style={{
          fontFamily: tokens.fonts.serif_italic,
          fontSize: tokens.fontSizes.principle,
          lineHeight: tokens.fontSizes.principle * 1.4,
          color: palette.text,
          fontStyle: 'italic'
        }}
      />
    </View>
  );
}
