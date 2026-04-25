import { View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import InlineText from './utils/InlineText';

// Trap = "ловушка". Универсальный блок-предупреждение. Цвет — фиолетовый
// акцент (отдельный от категории, чтобы блок выделялся даже когда категория
// уже использует фиолетовый).

const TRAP_PURPLE = '#A78BFA';

export default function TrapBlock({ label, text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={{
      marginVertical: 28,
      marginHorizontal: 24,
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: 'rgba(167, 139, 250, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(167, 139, 250, 0.25)',
      borderRadius: tokens.radius.tight
    }}>
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: 9.5,
        letterSpacing: 2.4,
        color: TRAP_PURPLE,
        textTransform: 'uppercase',
        marginBottom: 8
      }}>{label}</Text>
      <InlineText
        text={text}
        style={{
          fontFamily: tokens.fonts.serif_italic,
          fontSize: 15,
          lineHeight: 15 * 1.55,
          color: palette.text,
          fontStyle: 'italic'
        }}
      />
    </View>
  );
}
