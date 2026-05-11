import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function SubtitleBlock({ text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 24, paddingBottom: 24 }}>
      <InlineText
        text={text}
        style={{
          fontFamily: tokens.fonts.mono,
          fontSize: tokens.fontSizes.subtitle,
          letterSpacing: 1.6,
          color: palette.text_mute,
          textTransform: 'uppercase'
        }}
      />
    </View>
  );
}
