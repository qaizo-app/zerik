// CardBottomBar — последний блок внутри ScrollView карточки.
// Показывает: dots уровней глубины + текстовый hint + Save/Share кнопки.
//
// Поведение Save/Share — приходит callbacks от приложения (через CardScreen
// props), движок сам не управляет хранением. Это позволяет одному CardScreen
// работать как в Today (где saved берётся из progressService), так и в Library
// (где saved всегда true).

import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

function BookmarkIcon({ filled, color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? color : 'none'} stroke={color} strokeWidth={1.5}>
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

function ShareIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <Path d="M16 6l-4-4-4 4" />
      <Path d="M12 2v13" />
    </Svg>
  );
}

export default function CardBottomBar({
  card,
  isSaved,
  onSavePress,
  onSharePress,
  showSwipeUpHint = false
}) {
  const { palette, tokens } = useTheme();
  const levels = Array.isArray(card?.levels) ? card.levels : [{ level: 1 }];
  const totalLevels = levels.length;
  const currentLevel = 1;

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 18, paddingBottom: 28 }}>
      {/* Свайп вверх hint (опц.) */}
      {showSwipeUpHint && totalLevels > 1 ? (
        <View style={{ alignItems: 'center', paddingBottom: 16 }}>
          <Text style={{
            fontFamily: tokens.fonts.serif_display, fontSize: 14,
            color: palette.accent, marginBottom: 4
          }}>↑</Text>
          <Text style={{
            fontFamily: tokens.fonts.mono, fontSize: 10,
            letterSpacing: 1.6, color: palette.text_mute,
            textTransform: 'uppercase'
          }}>{t('swipe_up_deeper')}</Text>
        </View>
      ) : null}

      {/* Линия-разделитель */}
      <View style={{ height: 1, backgroundColor: palette.border, marginBottom: 14 }} />

      {/* Уровень + Save/Share */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Dots уровней */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Array.from({ length: totalLevels }).map((_, idx) => {
            const active = idx + 1 === currentLevel;
            return (
              <View key={idx} style={{
                width: active ? 20 : 6, height: 6,
                borderRadius: 3, marginRight: 6,
                backgroundColor: active ? palette.accent : palette.border_bright
              }} />
            );
          })}
          <Text style={{
            fontFamily: tokens.fonts.mono, fontSize: 9.5,
            letterSpacing: 1.6, color: palette.text_mute,
            textTransform: 'uppercase', marginLeft: 6
          }}>{t('level_indicator', { current: currentLevel, total: totalLevels })}</Text>
        </View>

        {/* Save / Share */}
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <Pressable onPress={onSavePress} hitSlop={10} style={{ padding: 4 }}>
            <BookmarkIcon
              filled={!!isSaved}
              color={isSaved ? palette.accent : palette.text_dim}
            />
          </Pressable>
          <Pressable onPress={onSharePress} hitSlop={10} style={{ padding: 4 }}>
            <ShareIcon color={palette.text_dim} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
