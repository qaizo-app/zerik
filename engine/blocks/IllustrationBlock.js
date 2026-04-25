// Иллюстрация. Для MVP — placeholder rectangle с категорийной grain-текстурой.
// SVG-рендер из bundle://... или gs://... — следующий шаг (react-native-svg).

import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function IllustrationBlock({ ref: _ref, alt }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      marginVertical: 20,
      marginHorizontal: 24,
      height: 180,
      borderRadius: tokens.radius.tight,
      backgroundColor: palette.bg_elev,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 9,
        letterSpacing: 1.4,
        color: palette.text_mute,
        textTransform: 'uppercase'
      }}>
        Illustration · placeholder
      </Text>
      {alt ? (
        <Text style={{
          marginTop: 6,
          fontFamily: tokens.fonts.serif_italic,
          fontSize: 11,
          color: palette.text_mute,
          textAlign: 'center',
          paddingHorizontal: 24,
          fontStyle: 'italic'
        }}>{alt}</Text>
      ) : null}
    </View>
  );
}
