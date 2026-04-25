import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function ActionTodayBlock({ label, text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      marginVertical: 30,
      marginHorizontal: 24,
      paddingVertical: 22,
      paddingHorizontal: 22,
      backgroundColor: palette.accent,
      borderRadius: tokens.radius.tight,
      overflow: 'hidden'
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 10,
        letterSpacing: 2.5,
        color: palette.ink_on_accent,
        opacity: 0.7,
        textTransform: 'uppercase',
        marginBottom: 10
      }}>{label}</Text>
      <Text style={{
        fontFamily: tokens.fonts.serif_italic,
        fontStyle: 'italic',
        fontSize: 19,
        lineHeight: 19 * 1.35,
        color: palette.ink_on_accent
      }}>{text}</Text>
    </View>
  );
}
