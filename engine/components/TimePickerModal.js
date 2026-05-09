// Простой пикер времени: hour (0-23) + minute (0-55, шаг 5).
// Без внешних зависимостей — стоковые компоненты RN.

import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

function pad2(n) { return String(n).padStart(2, '0'); }

function StepperColumn({ value, max, step = 1, onChange, label }) {
  const { palette, tokens } = useTheme();

  return (
    <View style={{ alignItems: 'center', gap: 12 }}>
      <Text style={{
        fontFamily: tokens.fonts.mono, fontSize: 10, letterSpacing: 1.8,
        color: palette.text_mute, textTransform: 'uppercase'
      }}>{label}</Text>

      <Pressable
        onPress={() => onChange((value + step) % (max + 1))}
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <Text style={{ fontFamily: tokens.fonts.mono, fontSize: 24, color: palette.accent, opacity: 0.8 }}>▲</Text>
      </Pressable>

      <Text style={{
        fontFamily: tokens.fonts.serif_display, fontSize: 56, lineHeight: 60,
        color: palette.accent, letterSpacing: -1.5, minWidth: 72, textAlign: 'center'
      }}>{pad2(value)}</Text>

      <Pressable
        onPress={() => onChange((value - step + (max + 1)) % (max + 1))}
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <Text style={{ fontFamily: tokens.fonts.mono, fontSize: 24, color: palette.accent, opacity: 0.8 }}>▼</Text>
      </Pressable>
    </View>
  );
}

export default function TimePickerModal({ visible, initialHour = 9, initialMinute = 0, title, onSave, onCancel, labelHour, labelMinute, labelSave, labelCancel }) {
  const { palette, tokens } = useTheme();
  const [h, setH] = useState(initialHour);
  const [m, setM] = useState(Math.round(initialMinute / 5) * 5);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 24
      }}>
        <View style={{
          width: '100%', maxWidth: 360,
          backgroundColor: palette.bg_elev,
          borderWidth: 1, borderColor: palette.border,
          borderRadius: 4, padding: 28,
        }}>
          {!!title && (
            <Text style={{
              fontFamily: tokens.fonts.serif_display, fontSize: 22, color: palette.text,
              marginBottom: 24, textAlign: 'center'
            }}>{title}</Text>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, marginBottom: 28 }}>
            <StepperColumn value={h} max={23} step={1} onChange={setH} label={labelHour || 'HOUR'} />
            <Text style={{ fontFamily: tokens.fonts.serif_display, fontSize: 56, color: palette.accent, opacity: 0.5, marginTop: 24 }}>:</Text>
            <StepperColumn value={m} max={55} step={5} onChange={setM} label={labelMinute || 'MIN'} />
          </View>

          <View style={{
            flexDirection: 'row', justifyContent: 'space-between',
            paddingTop: 16, borderTopWidth: 1, borderTopColor: palette.border
          }}>
            <Pressable onPress={onCancel} hitSlop={12} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
              <Text style={{
                fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.6,
                color: palette.text_mute, textTransform: 'uppercase'
              }}>{labelCancel || 'Cancel'}</Text>
            </Pressable>
            <Pressable onPress={() => onSave({ hour: h, minute: m })} hitSlop={12} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
              <Text style={{
                fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.6,
                color: palette.accent, textTransform: 'uppercase', fontWeight: '700'
              }}>{labelSave || 'Save'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
