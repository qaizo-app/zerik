// PaywallScreen — экран Pro-подписки. Работает в demo-режиме если RevenueCat
// не настроен (paywallService возвращает null offerings) — кнопка "Купить"
// просто закроет экран, для разработки UI этого достаточно.

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

export default function PaywallScreen({ paywallService, onPurchased, onClose }) {
  const { palette, tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [offerings, setOfferings] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState('yearly');

  useEffect(() => {
    if (!paywallService) return;
    paywallService.getOfferings().then(o => setOfferings(o)).catch(() => setOfferings(null));
  }, [paywallService]);

  async function handlePurchase() {
    if (!offerings || !paywallService) {
      // Demo mode — RC не настроен, просто закрываем.
      onClose?.();
      return;
    }
    const pkg = selected === 'yearly' ? offerings.annual : offerings.monthly;
    if (!pkg) { onClose?.(); return; }
    setBusy(true); setError(null);
    const res = await paywallService.purchasePackage(pkg);
    setBusy(false);
    if (res.success) onPurchased?.();
    else if (res.error !== 'cancelled') setError(res.message || res.error);
  }

  async function handleRestore() {
    if (!paywallService) return;
    setBusy(true);
    const res = await paywallService.restorePurchases();
    setBusy(false);
    if (res.success) {
      const active = await paywallService.hasActiveSubscription();
      if (active) onPurchased?.();
    }
  }

  // Demo-цены (показываются если offerings не пришли)
  const monthlyPrice = offerings?.monthly?.product?.priceString || '$4.99';
  const yearlyPrice  = offerings?.annual?.product?.priceString  || '$29.99';

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 24 }}>
      <Pressable onPress={onClose} style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.5,
          color: palette.text_mute, textTransform: 'uppercase'
        }}>×  {t('cancel')}</Text>
      </Pressable>

      <Text style={{
        fontFamily: tokens.fonts.serif_display, fontSize: 32,
        color: palette.text, marginBottom: 16
      }}>{t('upgrade_to_pro')}</Text>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={() => setSelected('yearly')}
        style={{
          borderWidth: 2,
          borderColor: selected === 'yearly' ? palette.accent : palette.border_bright,
          backgroundColor: selected === 'yearly' ? palette.bg_card : 'transparent',
          padding: 18, borderRadius: tokens.radius.tight, marginBottom: 12
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 2,
          color: palette.accent, textTransform: 'uppercase', marginBottom: 6
        }}>{t('yearly')}</Text>
        <Text style={{
          fontFamily: tokens.fonts.serif_display, fontSize: 24, color: palette.text
        }}>{yearlyPrice}</Text>
      </Pressable>

      <Pressable
        onPress={() => setSelected('monthly')}
        style={{
          borderWidth: 2,
          borderColor: selected === 'monthly' ? palette.accent : palette.border_bright,
          backgroundColor: selected === 'monthly' ? palette.bg_card : 'transparent',
          padding: 18, borderRadius: tokens.radius.tight, marginBottom: 24
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 2,
          color: palette.text_dim, textTransform: 'uppercase', marginBottom: 6
        }}>{t('monthly')}</Text>
        <Text style={{
          fontFamily: tokens.fonts.serif_display, fontSize: 24, color: palette.text
        }}>{monthlyPrice}</Text>
      </Pressable>

      {error ? (
        <Text style={{
          fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
          fontSize: 13, color: palette.picked, marginBottom: 8, textAlign: 'center'
        }}>{error}</Text>
      ) : null}

      <Pressable
        disabled={busy}
        onPress={handlePurchase}
        style={{
          backgroundColor: palette.accent,
          paddingVertical: 16, borderRadius: tokens.radius.tight,
          alignItems: 'center', marginBottom: 12, opacity: busy ? 0.6 : 1
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.mono_bold, fontSize: 12, letterSpacing: 2,
          color: palette.ink_on_accent, textTransform: 'uppercase'
        }}>{t('upgrade_to_pro')}</Text>
      </Pressable>

      <Pressable onPress={handleRestore}>
        <Text style={{
          fontFamily: tokens.fonts.mono, fontSize: 11, letterSpacing: 1.5,
          color: palette.text_mute, textTransform: 'uppercase', textAlign: 'center'
        }}>{t('restore_purchases')}</Text>
      </Pressable>
    </View>
  );
}
