import sakuraLottieUrl from '../assets/animations/sakura_falling_vector.lottie';
import { loadDotLottieAnimationData } from './dotLottie';

let lottieModulePromise = null;
let sessionHost = null;
let sessionAnimation = null;
let sessionReady = false;
let sessionLoadPromise = null;
let attachedContainer = null;
const readyListeners = new Set();

function getSessionHost() {
  if (typeof document === 'undefined') return null;

  if (!sessionHost) {
    sessionHost = document.createElement('div');
    sessionHost.className = 'sakura-animation__session-host';
    sessionHost.setAttribute('aria-hidden', 'true');
  }

  return sessionHost;
}

function getLottieModule() {
  if (!lottieModulePromise) {
    lottieModulePromise = import('lottie-web').then((module) => module.default || module);
  }
  return lottieModulePromise;
}

function notifyReady() {
  readyListeners.forEach((listener) => {
    try {
      listener();
    } catch (_) {
      // A decorative listener must never break the retained session animation.
    }
  });
}

export function isSakuraSessionReady() {
  return sessionReady;
}

export function subscribeSakuraSessionReady(listener) {
  if (typeof listener !== 'function') return () => {};

  readyListeners.add(listener);

  if (sessionReady) {
    // Promise microtasks work in substantially older WebViews than the
    // queueMicrotask global and keep this page-session cache fail-open.
    Promise.resolve().then(() => {
      if (readyListeners.has(listener)) listener();
    });
  }

  return () => readyListeners.delete(listener);
}

export function preloadSakuraAnimationSession() {
  if (sessionReady) return Promise.resolve(true);
  if (sessionLoadPromise) return sessionLoadPromise;

  const host = getSessionHost();
  if (!host) return Promise.resolve(false);

  const promise = (async () => {
    const [lottie, animationData] = await Promise.all([
      getLottieModule(),
      loadDotLottieAnimationData(sakuraLottieUrl),
    ]);

    if (sessionAnimation) return sessionReady;

    sessionAnimation = lottie.loadAnimation({
      container: host,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: false,
      },
    });

    await new Promise((resolve, reject) => {
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      };

      const fail = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Sakura Lottie failed to render'));
      };

      const cleanup = () => {
        sessionAnimation?.removeEventListener?.('DOMLoaded', finish);
        sessionAnimation?.removeEventListener?.('data_failed', fail);
      };

      sessionAnimation.addEventListener?.('DOMLoaded', finish);
      sessionAnimation.addEventListener?.('data_failed', fail);
    });

    sessionReady = true;

    if (attachedContainer) {
      sessionAnimation.play?.();
    } else {
      sessionAnimation.pause?.();
    }

    notifyReady();
    return true;
  })();

  sessionLoadPromise = promise;

  promise.catch(() => {
    if (sessionLoadPromise === promise) {
      sessionLoadPromise = null;
    }

    sessionReady = false;
    sessionAnimation?.destroy?.();
    sessionAnimation = null;

    if (sessionHost) {
      while (sessionHost.firstChild) {
        sessionHost.removeChild(sessionHost.firstChild);
      }
    }
  });

  return promise;
}

export function attachSakuraSession(container) {
  if (!container) return () => {};

  const host = getSessionHost();
  if (!host) return () => {};

  attachedContainer = container;

  try {
    // appendChild is intentionally used instead of replaceChildren(): some
    // Telegram WKWebViews have a much older DOM implementation even when the
    // same build works in Safari/Chrome. Clear manually, then move the retained
    // host node. This still happens in useLayoutEffect before paint.
    if (host.parentNode !== container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(host);
    }

    if (sessionReady) {
      sessionAnimation?.play?.();
    }
  } catch (error) {
    // Sakura is decorative. A DOM/WebView incompatibility must never take the
    // React tree down and leave the Telegram Mini App on a black screen.
    console.warn('Sakura session attach warning:', error);
    return () => {};
  }

  return () => {
    if (attachedContainer === container) {
      attachedContainer = null;
    }

    sessionAnimation?.pause?.();

    if (host.parentNode === container) {
      container.removeChild(host);
    }
  };
}
