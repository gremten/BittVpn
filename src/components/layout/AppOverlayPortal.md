# AppOverlayPortal

**Source:** `src/components/layout/AppOverlayPortal.js`

## Purpose

Internal portal used by fixed bottom surfaces (`AppTabBar` and `BottomSheet`). It renders them into the single runtime host `#bitt-app-overlay-root`, created once in `src/index.js`.

## Why it exists

A shared React component was not enough while each instance still lived inside a different screen/scroll container: CSS containing blocks, desktop absolute positioning and Telegram viewport/safe-area updates could make the same component land at different vertical baselines. The portal removes that variable completely.

## Invariants

- `AppTabBar` and `BottomSheet` must render through this portal.
- Screens/features never create their own fixed/absolute bottom-surface host.
- The host geometry lives only in `src/styles/globals.css` under `.app-overlay-root`.
- Mobile host = fixed app viewport; desktop host = the same centered 402×874 prototype viewport as `.app-shell`.
- The host has `pointer-events:none`; interactive surfaces re-enable pointer events on themselves.
- This component owns no visuals.
