# preloadAssets

**Source:** `src/utils/preloadAssets.js`

## Purpose

Warm local visual assets early enough to avoid route-to-route icon pop-in without delaying the first usable screen.

## Behavior

- Local assets under `src/assets/icons` and `src/assets/images` with `svg/png/webp/avif` extensions are discovered at build time with CRA/Webpack `require.context`. Referral smile animation SVG states are intentionally excluded because `ReferralSmileAnimation` owns their deferred mounting.
- Navigator state glyphs, toast success, and `icn_m_devices.svg` are excluded from detached-image warmup because they render inline through SVGR. This is important for `icn_m_devices.svg`: Telegram/WebView previously produced a broken/stalled `<img>` path for that SVG.
- Local image/SVG requests are started asynchronously through detached `Image` instances **before React render**, but App does **not** wait for the whole queue before rendering.
- `startBackgroundAssetWarmup()` is invoked before React render, but it only **schedules** work. No detached-image request is started before the first React paint. About 80 ms after first paint it starts avatar + small route/UI warmup with concurrency **6**; decorative/pulse assets wait for idle with concurrency **2**; the retained Sakura Lottie session initializes during idle; referral video waits for a later idle window.
- URLs and readiness Promises are deduplicated for the lifetime of the page. `waitForLocalVisualAssets()` still exists as a bounded helper for feature-level use, but App no longer uses it as a global gate.
- `Image.decode()` is attempted where available to warm decoded image data as well as the HTTP cache.
- Telegram `initDataUnsafe.user.photo_url` is an intentional runtime/user asset and is preloaded separately at low priority when present.

## Runtime asset policy

- Production UI must **never** depend on temporary Figma/MCP asset URLs. Figma is a design source, not a runtime CDN.
- Product-owned icons/images used by the UI must be stored locally in the project and bundled by the app.
- Approved runtime/user data such as the Telegram profile photo may remain remote when it is part of the actual product data contract.

## Before changing this

1. Read `/AGENTS.md`.
2. Keep network requests asynchronous; real UI may remain behind the existing initial skeleton until local UI visuals are warm.
3. Do not expand this into preloading heavy videos/Lottie bundles without an explicit reason; this utility is primarily for lightweight visual assets.

## Documentation update rule

If preload scope, timing, priority, remote-asset policy, or caching behavior changes, update this Markdown file in the same change.

## Session media

- Referral matrix rain is intentionally prebuffered here through `preloadReferralRainMedia()`.
- Unlike detached image warmup, referral rain is **session-persistent**: `referralRainSession.js` owns one `HTMLVideoElement` for the full page lifetime. Navigating away pauses/detaches it but does not clear its source, buffer, or current playback position.
- This is a deliberate exception to the old “do not preload heavy video” guidance because the runtime MP4 is only ~52 KB and repeated Referral entry was visibly recreating media.

## Mobile WebView fail-open

- Each detached image warmup has an **1800 ms** ceiling. `load`, `error`, or timeout all settle that asset's warmup promise.
- The initial local-visual readiness gate has an overall **2200 ms** ceiling. Normally assets finish first; the ceiling only prevents a broken WebView resource from leaving the whole Mini App in skeletons forever.
- Warmup uses `Promise.allSettled`, so one bad asset cannot reject the whole cache pass.
- This does not change the product loading rule for real asynchronous Block/Card data: those still use their own skeleton state until their actual data resolves.

## Concurrency / priority

- Detached local visual warmup is limited to **6 concurrent requests**.
- Regular screen/navigation icons are first, images second, referral SVG animation states later, and the 18-frame pulse set last.
- This prevents a burst of ~70 local requests from starving the Telegram profile photo or the first route on mobile.
- Telegram profile photo warmup uses high priority and starts before the local queue.

## Startup rule

- **Do not occupy the connection pool before first paint with speculative visual preloads.**
- Fonts and resources actually rendered by the first screen get first priority.
- Route-icon prewarm starts just after first paint; heavy decorative media is lazy/idle.
- This rule exists because a fast 100 Mbps connection was still showing ~5 s of skeletons: the bottleneck was request/decode/JS contention in Telegram WebView, not raw download bandwidth.


## Sakura session

- `sakuraSession.js` owns one rendered Lottie instance/DOM node for the whole page session.
- Background warmup initializes it during idle after first paint.
- Main navigation only attaches/detaches that retained node; repeat Main visits do not rebuild the Lottie SVG and do not replay the poster/loading transition.
