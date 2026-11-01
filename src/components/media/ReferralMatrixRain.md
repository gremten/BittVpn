# ReferralMatrixRain

**Source:** `src/components/media/ReferralMatrixRain.js`

## Purpose

Referral matrix-rain media layer backed by the original matrix-rain animation, transcoded from the source GIF into a lightweight looping MP4 for runtime.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `rootRef` | `required/controlled by caller` |
| `clipTargetRef` | `required/controlled by caller` |

## Invariants

- Use the local runtime MP4 asset `src/assets/animations/bitmap_matrix_rain_600x440_wave_slow.mp4`; do not point this component at an expiring Figma/MCP URL.
- The MP4 is backed by one session-persistent `HTMLVideoElement` from `src/utils/referralRainSession.js`. Do not recreate a new `<video src=...>` on each Referral mount.
- The original delivered source was `bitmap_matrix_rain_600x440_wave_slow.gif` (600×440, 300 frames, 30 fps, 9 seconds, ~2.9 MB). Runtime uses a lightweight H.264 MP4 transcode of the same motion to reduce bundle/runtime weight and to avoid Lottie/SVG artifacts.
- Natural animation size is 600×440; source timing is 30 fps, 300 frames, 9 seconds.
- The rain is a separate media layer under content.
- The clip boundary follows the live DOM bottom edge of referral stats via refs/measurement; do not hard-code a pixel mask.
- Final matrix-rain visibility is **20% on the composed output layer** (`.referral-rain-video { opacity: .2; }`).
- Respect `prefers-reduced-motion`: pause the video and pin it to the first frame.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/media/ReferralMatrixRain.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ReferralMatrixRain.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Session cache behavior

- App startup begins buffering the rain before the user opens Referral.
- Referral mount attaches the existing session video node to the rain host.
- Navigating away pauses and **detaches only**; it must not clear `src`, call `load()` again, or destroy the element.
- Re-entering Referral reattaches the same element with its existing buffer/currentTime, eliminating the repeated “rain loads in after the screen” effect.

## Telegram WebView compatibility

The retained session video is attached with legacy-safe `appendChild/removeChild`, not `replaceChildren`, so opening Referral cannot crash an older embedded Telegram WebView.
