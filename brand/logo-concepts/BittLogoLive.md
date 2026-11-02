# BittLogoLive

Variant 5 of the BittVPN logo concepts ("Interactive Live Systole"). Not used by the app yet — it lives in `brand/logo-concepts/` until the product owner picks a final mark.

## Concept
Latin **B** combined with a systole (ECG) trace on a dot-matrix grid. The trace enters on the baseline, dips (Q), spikes up (R) and drops to the bottom (S); that R→S drop is the stem of the B. Both bowls follow the grid; the waist line exits right as the continuation of the cardiogram. Static geometry is identical to `bitt-logo-v1-grid.svg`.

## Geometry
- 11×11 grid, 20 px step, 20 px padding → `viewBox="0 0 240 240"`.
- Grey grid dots `#3A3A3A`, r 6. Active nodes `#FFFFFF`, r 6.5. Connecting line 2.5 px, round caps/joins. Background `#000000`.
- Active nodes = every lattice point the trace passes through (computed, not hand-listed).

## API
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | number \| string | `240` | width/height of the SVG |
| `mode` | `'hover' \| 'loop' \| 'static'` | `'hover'` | when the pulse animation runs |
| `title` | string | `'BittVPN'` | accessible name (`<title>` + `aria-label`) |
| `className` | string | — | extra class on the root `<svg>` |

`mode="hover"` makes the SVG focusable (`tabIndex=0`) and also animates on keyboard focus.

## Animation
- One beat = 1600 ms. A bright 4 px pulse (`pathLength=1`, dash 0.14) sweeps the whole trace in the first 55% of the beat, then rests.
- While live, the base line dims to 35%; each node flares (opacity 1, scale 1.3 → 1) with a delay proportional to its distance along the trace, then settles at 35%.
- `prefers-reduced-motion: reduce` disables the animation and keeps the static mark.
- Styles are emitted inside the SVG and scoped by a `useId()`-derived class prefix; no global CSS, tokens or fonts.

## Constraints
- Self-contained: imports only React. Colours are fixed to the dot-matrix reference, not app tokens, so the mark renders identically in Telegram avatars, the Mini App and exports.
- Keep geometry in sync with `bitt-logo-v1-grid.svg` if either changes.
