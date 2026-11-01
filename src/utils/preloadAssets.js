import { getTelegramWebApp } from '../telegram';
import { preloadReferralRainMedia } from './referralRainSession';
import { preloadSakuraAnimationSession } from './sakuraSession';

const localVisualContexts = [
  { context: require.context('../assets/icons', true, /\.(?:svg|png|webp|avif)$/i), kind: 'icon' },
  { context: require.context('../assets/images', true, /\.(?:svg|png|webp|avif)$/i), kind: 'image' },
];

const INLINE_CRITICAL_SVG_KEYS = new Set([
  './icn_m_devices.svg',
  './nav/icn_m_home-filled.svg',
  './nav/icn_m_home-outline.svg',
  './nav/icn_m_set-filled.svg',
  './nav/icn_m_set-outline.svg',
  './nav/icn_m_profile_filled.svg',
  './nav/icn_m_profile_filled-1.svg',
  './nav/icn_m_help-filled.svg',
  './nav/icn_m_help.svg',
  './nav/icn_m_circle-success-filled.svg',
]);

export const LOCAL_VISUAL_ASSET_TIMEOUT_MS = 1800;
export const LOCAL_VISUAL_GATE_TIMEOUT_MS = 2200;
export const LOCAL_VISUAL_PRELOAD_CONCURRENCY = 6;

const imageReadinessByUrl = new Map();
const inflightImages = new Set();
let localVisualAssetsPromise = null;
let localVisualGatePromise = null;

function moduleUrl(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value.default === 'string') return value.default;
  return '';
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function warmImage(url, fetchPriority = 'auto') {
  if (!url || typeof Image === 'undefined') return Promise.resolve();

  const existing = imageReadinessByUrl.get(url);
  if (existing) return existing;

  const readiness = new Promise((resolve) => {
    const image = new Image();
    inflightImages.add(image);
    image.decoding = 'async';

    try {
      if ('fetchPriority' in image) image.fetchPriority = fetchPriority;
    } catch (_) {
      // Optional browser hint only.
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      inflightImages.delete(image);
      resolve();
    };

    image.addEventListener('load', finish);
    image.addEventListener('error', finish);

    const timeoutId = window.setTimeout(finish, LOCAL_VISUAL_ASSET_TIMEOUT_MS);
    image.src = url;

    try {
      image.decode?.().catch(() => {});
    } catch (_) {
      // Decode is cache optimization only, never readiness ownership.
    }
  });

  imageReadinessByUrl.set(url, readiness);
  return readiness;
}

function entryPriority(entry) {
  // Screen/navigation icons first. Large animation frame sets are deliberately
  // last so they cannot starve avatar and route-critical UI on mobile.
  if (entry.kind === 'icon' && !entry.key.startsWith('./pulse/')) return 0;
  if (entry.kind === 'image') return 1;
  if (entry.key.startsWith('./pulse/')) return 3;
  return 2;
}

function getLocalVisualEntries() {
  const entries = [];

  localVisualContexts.forEach(({ context, kind }) => {
    context.keys().forEach((key) => {
      if (INLINE_CRITICAL_SVG_KEYS.has(key)) return;
      const url = moduleUrl(context(key));
      if (url) entries.push({ key, url, kind });
    });
  });

  const unique = new Map();
  entries.forEach((entry) => {
    if (!unique.has(entry.url)) unique.set(entry.url, entry);
  });

  return [...unique.values()].sort((a, b) => entryPriority(a) - entryPriority(b));
}

async function warmEntriesWithConcurrency(entries, concurrency) {
  let cursor = 0;

  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor];
      cursor += 1;
      await warmImage(entry.url, entryPriority(entry) === 0 ? 'high' : 'auto');
    }
  }

  const workerCount = Math.min(concurrency, Math.max(1, entries.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}

export function preloadLocalVisualAssets() {
  if (!localVisualAssetsPromise) {
    localVisualAssetsPromise = warmEntriesWithConcurrency(
      getLocalVisualEntries(),
      LOCAL_VISUAL_PRELOAD_CONCURRENCY,
    ).then(() => undefined);
  }

  return localVisualAssetsPromise;
}

// Retained as a bounded helper for feature-level use, but App never waits on it.
export function waitForLocalVisualAssets() {
  if (!localVisualGatePromise) {
    localVisualGatePromise = Promise.race([
      preloadLocalVisualAssets(),
      delay(LOCAL_VISUAL_GATE_TIMEOUT_MS),
    ]).then(() => undefined);
  }

  return localVisualGatePromise;
}

export function preloadTelegramProfilePhoto() {
  const photoUrl = getTelegramWebApp()?.initDataUnsafe?.user?.photo_url;
  if (typeof photoUrl !== 'string' || !photoUrl) return Promise.resolve();
  return warmImage(photoUrl, 'high');
}

function getCoreRouteEntries() {
  return getLocalVisualEntries().filter((entry) => entryPriority(entry) <= 1);
}

function getDeferredEntries() {
  return getLocalVisualEntries().filter((entry) => entryPriority(entry) >= 2);
}

function scheduleAfterFirstPaint(callback, delayMs = 0) {
  window.requestAnimationFrame(() => {
    window.setTimeout(callback, delayMs);
  });
}

function scheduleIdle(callback, timeout = 1200) {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  window.setTimeout(callback, Math.min(timeout, 600));
}

export function startBackgroundAssetWarmup() {
  // Do not occupy the connection pool before the first React paint. Fonts and
  // the current screen's own resources get first priority.
  scheduleAfterFirstPaint(() => {
    // Avatar first/high-priority because it is the only approved remote image
    // and was visibly starved by the previous "preload everything now" burst.
    preloadTelegramProfilePhoto();

    // Small route UI icons/images warm shortly after first paint. Concurrency is
    // deliberately modest: fast enough before most navigation, without a burst.
    warmEntriesWithConcurrency(
      getCoreRouteEntries(),
      LOCAL_VISUAL_PRELOAD_CONCURRENCY,
    );
  }, 80);

  // Decorative/referral/pulse assets are not startup dependencies. Warm them
  // only when the browser becomes idle.
  scheduleIdle(() => {
    warmEntriesWithConcurrency(
      getDeferredEntries(),
      2,
    );
  }, 1200);

  // Sakura owns a retained page-session Lottie DOM/animation instance.
  // Initialize it during idle so route changes never have to recreate it.
  scheduleIdle(() => {
    preloadSakuraAnimationSession().catch(() => {
      // Decorative media is fail-open and may retry from the component later.
    });
  }, 900);

  // Referral video is even later and session-persistent once created.
  scheduleIdle(() => {
    preloadReferralRainMedia();
  }, 1800);
}
