// AuthScreen — Email + Google + Apple. Кнопки соц-провайдеров скрываются,
// если соответствующие нативные модули не доступны (Expo Go или платформа
// без поддержки).

import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { t } from '../i18n';

export default function AuthScreen({
  authService,
  onSuccess,
  onSkip,
  showApple = Platform.OS === 'ios'
}) {
  const { palette, tokens, brand } = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const inputStyle = {
    borderWidth: 1,
    borderColor: palette.border_bright,
    backgroundColor: palette.bg_elev,
    color: palette.text,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: tokens.fonts.serif_body,
    fontSize: 15.5,
    borderRadius: tokens.radius.tight,
    marginBottom: 10
  };

  async function handleEmailSubmit() {
    if (!email || !password) return;
    setBusy(true); setError(null);
    const fn = mode === 'login' ? authService.login : authService.register;
    const res = await fn.call(authService, email, password);
    setBusy(false);
    if (res.success) onSuccess?.(res.user);
    else setError(res.message || res.error);
  }

  async function handleGoogle() {
    setBusy(true); setError(null);
    const res = await authService.loginWithGoogle();
    setBusy(false);
    if (res.success) onSuccess?.(res.user);
    else if (res.error !== 'cancelled') setError(res.message || res.error);
  }

  async function handleApple() {
    setBusy(true); setError(null);
    const res = await authService.loginWithApple();
    setBusy(false);
    if (res.success) onSuccess?.(res.user);
    else if (res.error !== 'cancelled') setError(res.message || res.error);
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, paddingTop: insets.top + 32, paddingHorizontal: 24 }}>
      <Text style={{
        fontFamily: tokens.fonts.serif_display,
        fontSize: 32,
        color: palette.text,
        marginBottom: 8
      }}>{brand?.app?.name || 'Mental Models'}</Text>

      <Text style={{
        fontFamily: tokens.fonts.serif_italic,
        fontStyle: 'italic',
        fontSize: 15,
        color: palette.text_dim,
        marginBottom: 32
      }}>
        {brand?.app?.tagline?.[t('language') === 'Язык' ? 'ru' : 'en'] || ''}
      </Text>

      <TextInput
        placeholder={t('email')}
        placeholderTextColor={palette.text_mute}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={inputStyle}
      />
      <TextInput
        placeholder={t('password')}
        placeholderTextColor={palette.text_mute}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={inputStyle}
      />

      {error ? (
        <Text style={{
          fontFamily: tokens.fonts.serif_italic,
          fontStyle: 'italic',
          fontSize: 13,
          color: palette.picked,
          marginBottom: 8
        }}>{error}</Text>
      ) : null}

      <Pressable
        disabled={busy}
        onPress={handleEmailSubmit}
        style={{
          backgroundColor: palette.accent,
          paddingVertical: 14,
          borderRadius: tokens.radius.tight,
          alignItems: 'center',
          marginBottom: 16,
          opacity: busy ? 0.6 : 1
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.mono_medium,
          fontSize: 12,
          letterSpacing: 2,
          color: palette.ink_on_accent,
          textTransform: 'uppercase'
        }}>{mode === 'login' ? t('sign_in') : t('sign_up')}</Text>
      </Pressable>

      <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{
          fontFamily: tokens.fonts.mono,
          fontSize: 11,
          letterSpacing: 1.5,
          color: palette.text_dim,
          textTransform: 'uppercase'
        }}>{mode === 'login' ? t('sign_up') : t('sign_in')}</Text>
      </Pressable>

      <View style={{ height: 1, backgroundColor: palette.border, marginBottom: 24 }} />

      <Pressable
        disabled={busy}
        onPress={handleGoogle}
        style={{
          borderWidth: 1, borderColor: palette.border_bright,
          paddingVertical: 14, borderRadius: tokens.radius.tight,
          alignItems: 'center', marginBottom: 12
        }}
      >
        <Text style={{
          fontFamily: tokens.fonts.serif_body, fontSize: 15, color: palette.text
        }}>{t('continue_with_google')}</Text>
      </Pressable>

      {showApple ? (
        <Pressable
          disabled={busy}
          onPress={handleApple}
          style={{
            borderWidth: 1, borderColor: palette.border_bright,
            paddingVertical: 14, borderRadius: tokens.radius.tight,
            alignItems: 'center', marginBottom: 12
          }}
        >
          <Text style={{
            fontFamily: tokens.fonts.serif_body, fontSize: 15, color: palette.text
          }}>{t('continue_with_apple')}</Text>
        </Pressable>
      ) : null}

      <Pressable onPress={onSkip} style={{ alignItems: 'center', marginTop: 16 }}>
        <Text style={{
          fontFamily: tokens.fonts.serif_italic, fontStyle: 'italic',
          fontSize: 14, color: palette.text_mute
        }}>{t('skip_for_now')}</Text>
      </Pressable>
    </View>
  );
}
