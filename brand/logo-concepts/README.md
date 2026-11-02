# BittVPN logo concepts — B × systole

Five logo variants combining the Latin **B** with a systole (ECG) trace on a dot-matrix grid, based on the product owner's reference (muted grey dot grid, white active dots). Not wired into the app yet.

| # | Variant | File | Idea |
| --- | --- | --- | --- |
| 1 | Grid-Aligned ECG-B | `bitt-logo-v1-grid.svg` | Strictly on the grid. The QRS spike forms the stem; bowls are traced dot by dot; the waist line exits right. |
| 2 | Organic Waveform B | `bitt-logo-v2-organic.svg` | Smooth P-wave into a sharp QRS stem; bowls are continuous curves; white nodes only where curves cross grid points. |
| 3 | Cyber Glow Pulse | `bitt-logo-v3-cyber.svg` | Two beats (P-wave before the stem, T-wave on the exit), thin glowing lines and nodes, darker grid. |
| 4 | Minimalist Angular B | `bitt-logo-v4-minimal.svg` | Vertices only, chamfered bowls, small grid dots, lots of air. |
| 5 | Interactive Live Systole | `BittLogoLive.js` (+ `BittLogoLive.md`) | React component: static B from variant 1; on hover/focus or in a loop a pulse runs the trace and nodes flare. |

Shared grid: 11×11, 20 px step, `viewBox 0 0 240 240`, black background, grey `#3A3A3A` dots, white `#FFFFFF` active nodes. All files are self-contained (no external styles, tokens or fonts).

Usage of the live variant:

```jsx
import BittLogoLive from '../brand/logo-concepts/BittLogoLive';

<BittLogoLive size={56} mode="loop" />
```

When a final mark is chosen, move it into `src/assets` / `src/components` and follow `AGENTS.md` (local asset, same-name `.md`, `DOCS_INDEX.md`).
