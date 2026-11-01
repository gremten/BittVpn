# IconButton

**Source:** `src/components/ui/IconButton.js`

## Purpose

Design-system icon-only button family.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5928:21084` — `icnButton`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `icon` | `required/controlled by caller` |
| `children` | `required/controlled by caller` |
| `size` | `'xsmall'` |
| `type` | `'primary'` |
| `glass` | `'none'` |
| `color` | `'accent'` |
| `form` | `'circle'` |
| `className` | `required/controlled by caller` |
| `onClick` | `required/controlled by caller` |
| `ariaLabel` | `required/controlled by caller` |
| `disabled` | `false` |
| `...rest` | `forwarded` |

## Current Figma audit

- Current defaults: `size=xsmall`, `type=primary`, `glass=none`, `color=accent`, `form=circle`.
- Current size family remains exactly 24 / 32 / 44 / 56 px.
- Squircle radii remain 8 / 12 / 12 / 16 px for xsmall / small / medium / large; circle stays 999 px.
- Existing prototype usages pass their variants explicitly, so aligning the component defaults does not change those screens.
- **Product rule:** scale-based pressed feedback is always `transform: scale(0.985)`.

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- Preserve minimum interactive sizing and Figma-defined shapes/states.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/IconButton.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `IconButton.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Disabled icon state

- A disabled `IconButton` keeps the native `disabled` attribute and does not receive the pressed transform.
- Monochrome icon artwork is rendered through the same source asset as a mask while disabled, so the glyph uses the Figma `icon/action/disabled` color exactly: `#9499A1`.
- Do not create a separate disabled SVG for each icon; the shared component owns this visual state.
