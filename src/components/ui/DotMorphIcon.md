# DotMorphIcon

**Source:** `src/components/ui/DotMorphIcon.js`

## Purpose

Authored BittVPN `trash → check` transition for successful device deletion.

## Current production behavior

The motion itself keeps the previous 450 ms row/column treatment:

1. `0–99 ms` — trash dots merge into their existing horizontal/vertical runs.
2. `99–342 ms` — those runs move/rotate toward the check geometry.
3. `234–450 ms` — the moving line layer disappears while the **exact product check SVG** becomes the final endpoint.

The important correction is the endpoint: do **not** reconstruct the final check from `stroke-dasharray`.

The user-supplied `icn_el_check.svg` contains **22 real dots**. The previous line/dash reconstruction rendered only 17 visible dots in the mobile result, which is why the check looked malformed even though the morph itself was acceptable.

Production therefore imports the exact local source:

`src/assets/icons/morph-source/icn_el_check.svg`

and resolves the last animation phase directly onto that SVG. Final state is 1:1 with the source asset.

## Geometry used during motion

- 12 matched line runs.
- Dot diameter: `3.12110`.
- Grid pitch: `4.68360`.
- Dotted rhythm: `0.001 4.68260`.
- Temporary solid rhythm: `64 0`.
- Duration: 450 ms.
- Easing: symmetric `cubic-bezier(.45, 0, .55, 1)` for the line travel and exact-check fade.
- Key times: `0 / .22 / .76 / 1`.

These compact lines are only intermediate animation geometry. They are **not authoritative endpoint artwork**.

## Reduced motion

Reduced-motion users receive the exact final check SVG immediately.

## Morphicons prototype

The earlier Morphicons implementation remains preserved under:

`src/components/ui/experiments/MorphiconsDotPrototype.js`

It is not the current production path.

## Product use

`DeviceDeleteSheet` success state `7299:39655` mounts `DotMorphIcon icon="check"` inside the existing 90×90 status shell.

The success sheet closes automatically after 3 seconds or by normal BottomSheet dismissal.
