# BottomSheet

**Source:** `src/components/overlays/BottomSheet.js`

## Purpose

Single reusable bottom-sheet shell. Every flow reuses the same overlay, safe-area, grabber, surface and gesture behavior; only inner content differs.

## Figma source

- shared component: `7166:122124`

## Shared geometry

- black overlay: 40%;
- surface: `rgba(22,26,32,.85)`;
- backdrop blur: 11.2 px;
- shadow: `0 -4px 12px rgba(0,0,0,.16)`;
- top padding: 44 px;
- horizontal padding: 20 px + safe insets;
- bottom CTA clearance: `--app-bottom-cta-clearance`;
- `--app-bottom-cta-clearance = 20px + max(34px, system safe bottom)`, so the CTA bottom edge is exactly shared with `AppTabBar type="action"`; at the 34 px Figma/iOS reference the result is 54 px;
- radius: 36 px top corners only; bottom corners square;
- surface gap: 32 px;
- grabber: 36×4 in the 24 px grab zone;
- overlay/surface z-index: 55/56, above AppTabBar 50.

There is no per-instance `bottomSafeArea` mode and no feature-specific CTA baseline calculation.

## Invariant

Feature CSS must not override `.bottom-sheet` padding, radius, background, blur, position, bottom offset, safe-area math or root gap. Feature classes own only content inside the shell.

AppTabBar action and BottomSheet must consume the same `--app-bottom-cta-clearance` token. This is intentionally stronger than maintaining two mathematically equivalent formulas, because Telegram/WebView safe-area reporting previously exposed a visible 6 px drift between them.

The scroll lock intentionally avoids `body { position: fixed; top: -scrollY }`; that WebView pattern previously pushed a fixed sheet below the visible viewport after scrolling.
