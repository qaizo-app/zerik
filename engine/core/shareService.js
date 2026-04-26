// ShareService — экспорт карточки как PNG и системное share.
//
// Стратегия:
//   1. Если передан viewRef → captureRef (точный capture View)
//   2. Иначе → captureScreen (весь viewport, проще, не требует forwardRef chain)
//   3. Если react-native-view-shot не установлен → URL fallback
//
// captureScreen захватывает и tab bar внизу — известный trade-off. Для чистого
// share-preview без UI-хрома понадобится отдельный экран (backlog).

let _captureRef    = null;
let _captureScreen = null;
try {
  const ViewShot = require('react-native-view-shot');
  _captureRef    = ViewShot.captureRef;
  _captureScreen = ViewShot.captureScreen;
} catch (e) {}

let _Sharing = null;
try {
  _Sharing = require('expo-sharing');
} catch (e) {}

export const shareService = {

  isImageCaptureAvailable() {
    return !!(_captureRef || _captureScreen);
  },

  async isSharingAvailable() {
    if (!_Sharing) return false;
    try { return await _Sharing.isAvailableAsync(); } catch (e) { return false; }
  },

  /**
   * Capture View по ref. Возвращает URI к временному PNG файлу.
   */
  async captureView(viewRef, options = {}) {
    if (!_captureRef) throw new Error('react-native-view-shot not available');
    return await _captureRef(viewRef, {
      format: options.format || 'png',
      quality: options.quality != null ? options.quality : 1,
      result: 'tmpfile'
    });
  },

  /**
   * Capture весь экран (viewport). Не требует ref.
   */
  async captureScreen(options = {}) {
    if (!_captureScreen) throw new Error('react-native-view-shot not available');
    return await _captureScreen({
      format: options.format || 'png',
      quality: options.quality != null ? options.quality : 1,
      result: 'tmpfile'
    });
  },

  /**
   * Share карточки как картинки. Если viewRef передан — capture его, иначе
   * capture весь экран. Fallback — URL share с заголовком карточки.
   */
  async shareCard(viewRef, { card, locale = 'ru', fallbackUrl } = {}) {
    const haveSharing = await this.isSharingAvailable();
    if (!haveSharing) return { success: false, error: 'sharing_unavailable' };

    // Image path 1: capture by ref
    if (_captureRef && viewRef?.current) {
      try {
        const uri = await this.captureView(viewRef, { format: 'png', quality: 1 });
        await _Sharing.shareAsync(uri, {
          dialogTitle: cardTitle(card, locale),
          mimeType: 'image/png',
          UTI: 'public.png'
        });
        return { success: true, mode: 'image_ref', uri };
      } catch (e) {
        if (__DEV__) console.warn('[shareService.captureView] failed:', e?.message);
      }
    }

    // Image path 2: capture full screen
    if (_captureScreen) {
      try {
        const uri = await this.captureScreen({ format: 'png', quality: 1 });
        await _Sharing.shareAsync(uri, {
          dialogTitle: cardTitle(card, locale),
          mimeType: 'image/png',
          UTI: 'public.png'
        });
        return { success: true, mode: 'image_screen', uri };
      } catch (e) {
        if (__DEV__) console.warn('[shareService.captureScreen] failed:', e?.message);
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
