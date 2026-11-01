# Button

**Source:** `src/components/ui/Button.js`

## Purpose

Primary design-system button family.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5335:15155` — `button`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `label` | `required/controlled by caller` |
| `icon` | `required/controlled by caller` |
| `size` | `'xsmall'` |
| `type` | `'primary'` |
| `form` | `'circle'` |
| `color` | `'accent'` |
| `state` | `'default'` |
| `fullWidth` | `false` |
| `disabled` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |
| `onClick` | `required/controlled by caller` |
| `ariaLabel` | `required/controlled by caller` |
| `showDiscount` | `false` |
| `discountLabel` | `required/controlled by caller` |
| `strikedLabel` | `required/controlled by caller` |
| `...rest` | `forwarded` |

## Current Figma audit

- Current component-set defaults are `size=xsmall`, `type=primary`, `form=circle`, `color=accent`, `state=default`.
- Used prototype variants were rechecked against `5335:15155`: xsmall 24 px, small 32 px, medium 44 px, large 56 px; current label typography remains 12/16, 14/18, and 16/20 as appropriate.
- Outlined keeps the Figma 1.5 px round-dot stroke (`dashPattern [0.1, 3]`) at border/primary 20%.
- **Product rule:** any Button pressed scale is `0.985`, including xsmall outlined. Do not add stronger/weaker per-size press scales.

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- Keep variants aligned with FIGMA_VARIANTS; do not invent one-off visual variants in screens.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Button.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Button.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
