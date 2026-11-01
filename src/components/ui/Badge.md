# Badge

**Source:** `src/components/ui/Badge.js`

## Purpose

Design-system badge family mirrored from Figma.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5964:23023` — `badge`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `size` | `'xsmall'` |
| `color` | `'surface'` |
| `icon` | legacy alias for `leadingIcon` |
| `leadingIcon` | optional 16 px (xsmall/small) or 24 px (medium) icon |
| `trailingIcon` | optional symmetric trailing icon |
| `className` | `required/controlled by caller` |

## Current Figma geometry

- Default is `size=xsmall`, `color=surface`.
- xsmall: 24 px high, `4px 8px` padding, 12/16.
- small: 32 px high, **`7px 12px`** padding, 14/18.
- medium: 44 px high, **`10px 16px`** padding, 16/20.
- Surface / elevated / inverse backgrounds are `#161A20` / `#242A33` / white. Inverse content uses on-color.
- The current Figma master supports icons on both sides of the padded label. Code keeps the old `icon` prop as a leading-icon alias and adds explicit `leadingIcon` / `trailingIcon`.

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Badge.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Badge.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
