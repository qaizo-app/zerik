import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function TitleBlock({ text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 18 }}>
      <InlineText
        text={text}
        style={{
          fontFamily: tokens.fonts.serif_display,
          fontSize: tokens.fontSizes.title,
          lineHeight: tokens.fontSizes.title * 1.05,
          letterSpacing: -0.4,
          color: palette.text
        }}
      />
    </View>
  );
}
