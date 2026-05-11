import { View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

export default function HookBlock({ text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      paddingTop: tokens.spacing[4],
      paddingHorizontal: tokens.screen.card_padding_h_text
    }}>
      <InlineText
        text={text}
        style={{
          fontFamily: tokens.fonts.serif_light,
          fontSize: tokens.fontSizes.hook,
          lineHeight: tokens.fontSizes.hook * 1.5,
          fontStyle: 'italic',
          color: palette.text_dim
        }}
      />
    </View>
  );
}
