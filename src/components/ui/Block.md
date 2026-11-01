# Block

**Source:** `src/components/ui/Block.js`

## Purpose

Reusable surface block mirrored from Figma.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5943:16932` — `block`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | rendered only in `default`; hidden automatically in `loading` |
| `state` | `'default'` |
| `type` | `'regular'` |
| `className` | `required/controlled by caller` |
| `...rest` | `forwarded` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.


## Loading / skeleton contract

- Figma `5943:16932` defines `state=loading` as the canonical Block loading placeholder: `bg/loading` (`#262C3B`) at 60% opacity, **30 px** white blinking strip at 20% opacity, **37.5 px blur**.
- The blinking strip loops smoothly from completely off the left edge to completely off the right edge. The reset happens off-canvas, so there is no visible jump between cycles.
- `state="loading"` is self-contained: normal children are not rendered underneath the skeleton and the block exposes `aria-busy="true"`.
- **Any asynchronous UI whose final surface is a Block must use `Block state="loading"` while waiting.** Do not invent local spinners, blank blocks, or one-off skeleton markup inside screens.
- The default loading Block is at least **76 px** high. A screen may increase the skeleton height when the final Figma block is taller, but it must not restyle or replace the shared blinking effect.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Block.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Block.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
