const APP_BG = '#0A0C0F';
const TABBAR_NATIVE_BG = '#12161C';
const SHEET_NATIVE_BG = '#14171D';

export function getTelegramWebApp() {
  try {
    return window.Telegram?.WebApp ?? null;
  } catch (_) {
    return null;
  }
}

export function isTelegramMiniApp() {
  try {
    const tg = getTelegramWebApp();
    if (!tg) return false;

    return Boolean(
      tg.initData ||
      (typeof tg.platform === 'string' && tg.platform !== '' && tg.platform !== 'unknown')
    );
  } catch (_) {
    return false;
  }
}


export const DEFAULT_SHARE_MESSAGE = 'Приглашаю тебя посетить мой ускоритель интернета';
export const DEFAULT_TELEGRAM_MINI_APP_URL = 'https://t.me/bittvpn_bot/open';
export const DEFAULT_REFERRAL_URL = 'https://bitt.io/r/45454522';

/**
 * Telegram Mini App deep link used by referral/share actions.
 *
 * Keep the public TMA entry point here rather than sharing the hosting/web-site
 * URL. A production environment can override it without touching the UI code.
 */
export function getAppShareUrl() {
  return process.env.REACT_APP_TELEGRAM_MINI_APP_URL?.trim() || DEFAULT_TELEGRAM_MINI_APP_URL;
}

export function getReferralUrl() {
  return process.env.REACT_APP_REFERRAL_URL?.trim() || DEFAULT_REFERRAL_URL;
}

export function getTelegramShareUrl({
  url = getAppShareUrl(),
  text = DEFAULT_SHARE_MESSAGE,
} = {}) {
  // Do not use URLSearchParams here: application/x-www-form-urlencoded turns
  // spaces into `+`. Telegram share links are clearer and more predictable with
  // regular URI encoding (`%20`), so the prepared text never contains pluses.
  const encodedUrl = encodeURIComponent(url);
  const encodedText = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://t.me/share/url?url=${encodedUrl}${encodedText}`;
}

/**
 * Opens Telegram's native chat chooser with a prepared URL + message.
 * Falls back to the regular t.me share link when the build is previewed
 * outside the Telegram Mini App.
 */
export function shareAppInTelegram(options = {}) {
  const shareUrl = getTelegramShareUrl(options);
  const tg = getTelegramWebApp();

  if (tg && isTelegramMiniApp() && typeof tg.openTelegramLink === 'function') {
    try {
      tg.openTelegramLink(shareUrl);
      return;
    } catch (error) {
      console.warn('Telegram share warning:', error);
    }
  }

  const opened = window.open(shareUrl, '_blank', 'noopener,noreferrer');
  if (!opened) {
    window.location.assign(shareUrl);
  }
}


export function shareReferralInTelegram(options = {}) {
  return shareAppInTelegram({
    url: getReferralUrl(),
    text: 'Попробуй BittVPN по моей ссылке',
    ...options,
  });
}


export function getRuntimeFormFactor() {
  const tg = getTelegramWebApp();

  if (tg && isTelegramMiniApp()) {
    const platform = String(tg.platform || '').toLowerCase();

    // Telegram reports the client platform. iOS and Android are the adaptive
    // phone/tablet layout; desktop, macOS and Telegram Web use the fixed
    // prototype viewport below.
    if (platform === 'ios' || platform === 'android') return 'mobile';
    if (platform && platform !== 'unknown') return 'desktop';
  }

  // Browser fallback for opening the same build outside Telegram.
  if (typeof navigator.userAgentData?.mobile === 'boolean') {
    return navigator.userAgentData.mobile ? 'mobile' : 'desktop';
  }

  const userAgent = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ? 'mobile' : 'desktop';
}

function syncRuntimeFormFactorClass() {
  const root = document.documentElement;
  const formFactor = getRuntimeFormFactor();
  root.classList.toggle('is-mobile-runtime', formFactor === 'mobile');
  root.classList.toggle('is-desktop-runtime', formFactor === 'desktop');
  return formFactor;
}

function syncTelegramViewportClasses(tg) {
  const root = document.documentElement;
  root.classList.toggle('is-telegram-fullscreen', Boolean(tg?.isFullscreen));
}

export function initTelegramWebApp() {
  try {
    const tg = getTelegramWebApp();
    const isMiniApp = isTelegramMiniApp();

    document.documentElement.classList.toggle('is-telegram-mini-app', isMiniApp);
    const runtimeFormFactor = syncRuntimeFormFactorClass();
    syncTelegramViewportClasses(tg);

    if (!tg || !isMiniApp) {
      return null;
    }

    tg.setBackgroundColor?.(APP_BG);
    tg.setHeaderColor?.(APP_BG);

    if (tg.isVersionAtLeast?.('7.10')) {
      tg.setBottomBarColor?.(TABBAR_NATIVE_BG);
    }

    // The purchase sheet has its own vertical drag gesture. Disable Telegram's
    // minimize/close swipe so the two gestures do not compete. The Mini App
    // can still be closed/minimized using Telegram's native fullscreen UI.
    if (tg.isVersionAtLeast?.('7.7')) {
      tg.disableVerticalSwipes?.();
    }

    // App.js owns internal navigation and shows BackButton on non-main screens.
    // Start hidden until React mounts the active screen.
    tg.BackButton?.hide?.();

    tg.expand?.();

    // Bot API 8.0+: immersive fullscreen is useful on phones, where the
    // layout intentionally follows the device. On desktop we keep Telegram's
    // normal WebView and render the prototype in a local 402 × 874 viewport.
    if (tg.isVersionAtLeast?.('8.0') && runtimeFormFactor === 'mobile') {
      const syncViewport = () => syncTelegramViewportClasses(tg);
      tg.onEvent?.('fullscreenChanged', syncViewport);
      tg.onEvent?.('safeAreaChanged', syncViewport);
      tg.onEvent?.('contentSafeAreaChanged', syncViewport);

      if (!tg.isFullscreen) {
        tg.requestFullscreen?.();
      } else {
        syncViewport();
      }
    }
    return tg;
  } catch (error) {
    // Browser fallback and older Telegram clients should continue to render
    // the regular web version even if Telegram detection or any native API is
    // unavailable/buggy. Never let bootstrap fail before React mounts.
    console.warn('Telegram Mini App initialization warning:', error);
    try {
      document.documentElement.classList.remove('is-telegram-fullscreen');
      syncRuntimeFormFactorClass();
    } catch (_) {
      // Last-resort browser rendering needs no Telegram-specific classes.
    }
    return null;
  }
}

export function markTelegramReady() {
  const tg = getTelegramWebApp();
  if (!tg || !isTelegramMiniApp()) return;

  try {
    tg.ready?.();
  } catch (error) {
    console.warn('Telegram Mini App ready() warning:', error);
  }
}

export function syncTelegramChrome(sheetOpen) {
  const tg = getTelegramWebApp();
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const bottomColor = sheetOpen ? SHEET_NATIVE_BG : TABBAR_NATIVE_BG;

  // This remains useful when the same build is opened directly in Safari.
  metaThemeColor?.setAttribute('content', sheetOpen ? SHEET_NATIVE_BG : APP_BG);

  if (!tg || !isTelegramMiniApp()) return;

  try {
    tg.setBackgroundColor?.(APP_BG);
    tg.setHeaderColor?.(APP_BG);

    if (tg.isVersionAtLeast?.('7.10')) {
      tg.setBottomBarColor?.(bottomColor);
    }
  } catch (error) {
    console.warn('Telegram Mini App chrome sync warning:', error);
  }
}

export const TELEGRAM_COLORS = {
  app: APP_BG,
  tabbar: TABBAR_NATIVE_BG,
  sheet: SHEET_NATIVE_BG,
};
