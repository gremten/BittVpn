# appReadiness

**Source:** `src/utils/appReadiness.js`

## Purpose

One page-session readiness promise for product fonts.

## Contract

- Wait for `Golos UI`, `Martian Grotesk`, and `Nothing Font` before App replaces the initial loading skeleton with real UI in the normal path.
- Cache the promise at module scope so navigation never re-runs font readiness.
- The visual loading representation belongs to `Skeleton`, `Block state="loading"`, and `Card state="loading"`; this utility has no UI.

## Mobile recovery ceiling

- Font readiness is bounded at **1200 ms**. This is only a fail-open recovery path for buggy/slow WebViews; normally the real font promises resolve first.
- A font API stall must never leave the whole application permanently in the initial skeleton.
