# sakuraSession

**Source:** `src/utils/sakuraSession.js`

## Purpose

Own exactly one rendered Sakura Lottie instance for the full browser/page session.

## Why

Caching only the `.lottie` fetch/parsed JSON was insufficient. `MainScreen` unmounts when switching root screens, so `SakuraAnimation` used to destroy its Lottie instance. Reopening Main then rebuilt the SVG DOM and visibly switched from the poster to the animation again, even though the network asset was already cached.

## Contract

- One module-scope Lottie host DOM node for the whole page session.
- One module-scope `lottie-web` animation instance.
- One cached `lottie-web` dynamic-import Promise.
- Parsed `.lottie` data still comes from `dotLottie.js`, which is separately cached by URL.
- Navigating away only **pauses and detaches** the retained host. It never destroys the animation.
- Re-entering Main attaches the same host in `useLayoutEffect`, before paint, and resumes from its retained animation state. Attachment deliberately uses legacy-safe `appendChild/removeChild`, not `replaceChildren`, because Telegram WKWebView capabilities can lag behind the standalone browser on the same device.
- Once the session animation has reached `DOMLoaded`, revisits initialize as ready immediately; the poster is never intentionally shown again for that page session.
- Failed initialization destroys the broken instance and clears the load Promise so a later attempt may retry.

## Startup

`preloadAssets.startBackgroundAssetWarmup()` starts session initialization during idle after first paint. `SakuraAnimation` also keeps its own idle fallback so tests/isolated renders still initialize correctly.

This media must never block global App readiness.

## Telegram compatibility

- Do not use `queueMicrotask` here; use `Promise.resolve().then(...)` for the ready callback.
- Do not use `replaceChildren` for the retained host.
- Attachment is wrapped fail-open: Sakura is decorative and must never be able to crash the React root into a black Mini App.
