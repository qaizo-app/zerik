// Иллюстрация. Резолвит slug из ref через illustration registry.
// Если иллюстрация не зарегистрирована — показывает компактный placeholder.
// Реальные SVG живут в apps/<name>/illustrations/ и регистрируются на старте приложения.

import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getIllustration, refToSlug } from './illustrations/registry';

export default function IllustrationBlock({ ref: refStr, alt }) {
  const { palette, tokens } = useTheme();
  const slug = refToSlug(refStr);
  const Component = slug ? getIllustration(slug) : null;

  if (Component) {
    return (
      <View style={{
        marginVertical: 20,
        marginHorizontal: 24,
        height: 180,
        borderRadius: tokens.radius.tight,
        overflow: 'hidden'
      }}>
        <Component palette={palette} width="100%" height={180} />
      </View>
    );
  }

  return (
    <View style={{
      marginVertical: 20,
      marginHorizontal: 24,
      height: 120,
      borderRadius: tokens.radius.tight,
      backgroundColor: palette.bg_elev,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 9,
        letterSpacing: 1.4,
        color: palette.text_mute,
        textTransform: 'uppercase'
      }}>
        Illustration · {slug || 'placeholder'}
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
