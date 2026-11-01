# referralRainSession

**Source:** `src/utils/referralRainSession.js`

## Purpose

Keep matrix-rain media warm for the entire Mini App page session.

## Contract

- Own exactly one `HTMLVideoElement` and assign the local MP4 `src` once.
- `preloadReferralRainMedia()` begins buffering at app startup.
- Referral mount may attach the node; unmount may pause/detach it.
- Never clear `src`, recreate the video for navigation, or call `load()` on every screen entry.
- Buffer/currentTime are deliberately retained until the whole page/webview session ends.
