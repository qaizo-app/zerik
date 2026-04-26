// ShareService — экспорт карточки в PNG и системное share. Используется
// react-native-view-shot для capture любого View по ref.
//
// Captured screen рендерится на основе CardScreen в "share-mode" (без bottom-bar
// и tab navigation, с маленьким footer-логотипом приложения для соцсетей).
//
// Если react-native-view-shot не установлен (Expo Go) — fallback на text-share.

import * as FileSystem from 'expo-file-system';

let _captureRef = null;
try {
  _captureRef = require('react-native-view-shot').captureRef;
} catch (e) {}

let _Sharing = null;
try {
  _Sharing = require('expo-sharing');
} catch (e) {}

export const shareService = {

  isImageCaptureAvailable() {
    return !!_captureRef;
  },

  async isSharingAvailable() {
    if (!_Sharing) return false;
    try { return await _Sharing.isAvailableAsync(); } catch (e) { return false; }
  },

  /**
   * @param {React.RefObject} viewRef ref на View, который нужно захватить
   * @param {object} options { format?: 'png' | 'jpg', quality?: number }
   * @returns {Promise<string>} URI к PNG файлу
   */
  async captureView(viewRef, options = {}) {
    if (!_captureRef) throw new Error('react-native-view-shot not available');
    const uri = await _captureRef(viewRef, {
      format: options.format || 'png',
      quality: options.quality != null ? options.quality : 1,
      result: 'tmpfile'
    });
    return uri;
  },

  /**
   * Share картинки (если view-shot доступен) или текста (fallback).
   */
  async shareCard(viewRef, { card, locale = 'ru', fallbackUrl } = {}) {
    const haveSharing = await this.isSharingAvailable();
    if (!haveSharing) return { success: false, error: 'sharing_unavailable' };

    // Image path: capture + share file
    if (_captureRef && viewRef?.current) {
      try {
        const uri = await this.captureView(viewRef, { format: 'png', quality: 1 });
        await _Sharing.shareAsync(uri, {
          dialogTitle: cardTitle(card, locale),
          mimeType: 'image/png',
          UTI: 'public.png'
        });
        return { success: true, mode: 'image', uri };
      } catch (e) {
        if (__DEV__) console.warn('[shareService.captureView] failed:', e?.message);
        // fall through to text share
      }
    }

    // Fallback: text share с URL
    try {
      const url = fallbackUrl || `https://zerik.app/cards/${card?.id || ''}`;
      await _Sharing.shareAsync(url, { dialogTitle: cardTitle(card, locale) });
      return { success: true, mode: 'url', uri: url };
    } catch (e) {
      return { success: false, error: e?.message || 'share_failed' };
    }
  }
};

function cardTitle(card, locale) {
  const localeContent = card?.i18n?.[locale] || card?.i18n?.en || {};
  const titleBlock = (localeContent.blocks || []).find(b => b.type === 'title');
  return titleBlock?.props?.text?.replace(/\{\{accent:([^}]+)\}\}/g, '$1') || card?.id || '';
}

export default shareService;
