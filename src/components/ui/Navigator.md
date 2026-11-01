# Navigator

**Source:** `src/components/ui/Navigator.js`

## Purpose

Main four-item bottom navigation pill.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5951:24662` — `navigator`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `selected` | `'home'` |
| `onSelect` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- The visible navigator is only the black pill; no extra dark plate behind it.
- Selection is a UI state; App owns screen navigation.
- Preserve drag/scrub and touch behavior already implemented.
- All eight Navigator glyph states are bundled as **inline React SVG components** from the local Figma exports (`ReactComponent` imports). Do not render Navigator glyphs through `<img>` or temporary Figma URLs; they must be present in the DOM on the first frame of nav motion.
- Active Navigator SVG files themselves use the current Figma `icon/on-color` fill `#0A0C0F`; do not recolor them with a CSS `brightness(0)` filter. The inactive Profile glyph was re-exported from the current Figma `selected=home` variant.
- Current active configuration label is **`Локации`**. Keep the exact Figma variant geometry: 300 / 312 / 315 / 301 px outer widths for Home / Locations / Profile / Help.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Navigator.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Navigator.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
