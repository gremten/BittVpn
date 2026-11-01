# SakuraAnimation

**Source:** `src/components/media/SakuraAnimation.js`

## Purpose

Local Sakura Lottie media used by the Japan promo.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `className` | `''` |

## First resolution

- First frame uses the tiny local `src/assets/images/main/sakura.png` poster.
- Runtime source remains local `sakura_falling_vector.lottie` (~18 KB).
- Initialization stays idle/deferred and never blocks App readiness.
- If Lottie initialization fails, the poster is the complete fail-open visual.

## Page-session persistence

Reopening Main must **not** replay the poster → Lottie loading transition.

`src/utils/sakuraSession.js` owns one rendered Lottie instance and its DOM node for the full page session:

- `.lottie` fetch/decompression/parsed data is cached;
- `lottie-web` module is cached;
- rendered SVG DOM is retained;
- navigating away pauses + detaches only;
- returning attaches the same retained node in `useLayoutEffect` and resumes it;
- once `DOMLoaded` happened, `SakuraAnimation` initializes with `ready=true`, so the poster starts hidden on every later Main visit.

Do not call `animation.destroy()` on screen unmount. Destroying the instance is exactly what caused the repeated visible “asset loads in again” effect shown in the 2026-09-03 mobile recording.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and `src/utils/sakuraSession.md`.
3. Preserve page-session persistence; first-load optimization must not regress repeat navigation.
