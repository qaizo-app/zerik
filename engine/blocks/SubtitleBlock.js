import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function SubtitleBlock({ text }) {
  const { palette, tokens } = useTheme();
  return (
    <Text style={{
      marginTop: 10,
      paddingHorizontal: 24,
      paddingBottom: 24,
      fontFamily: tokens.fonts.mono,
      fontSize: tokens.fontSizes.subtitle,
      letterSpacing: 1.6,
      color: palette.text_mute,
      textTransform: 'uppercase'
    }}>
      {text}
    </Text>
  );
}
