# ButtonGroup

**Source:** `src/components/ui/ButtonGroup.js`

## Purpose

Layout component for grouped buttons.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5943:17729` — `group button`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `type` | `'horizontal'` |
| `className` | `required/controlled by caller` |
| `...rest` | `forwarded` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/ButtonGroup.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ButtonGroup.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
