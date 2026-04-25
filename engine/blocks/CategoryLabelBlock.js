import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function CategoryLabelBlock({ text }) {
  const { palette, tokens } = useTheme();
  return (
    <View style={[styles.container, { paddingTop: tokens.spacing[8] }]}>
      <View style={[styles.dash, { backgroundColor: palette.accent }]} />
      <Text style={{
        fontFamily: tokens.fonts.mono,
        fontSize: tokens.fontSizes.category_label,
        letterSpacing: 2,
        color: palette.accent,
        textTransform: 'uppercase'
      }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 10
  },
  dash: { width: 14, height: 1 }
});
