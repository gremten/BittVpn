# Chip

**Source:** `src/components/ui/Chip.js`

## Purpose

Small chip control and states.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6436:32497` — `chip`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `size` | `'small'` |
| `state` | `'default'` |
| `onClick` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |

## Styling

- `src/components/ui/bitt-ui.css`
- Current Figma `size=small` geometry (`6436:32497` / master `6436:32491`): **HUG width**, 32 px height, `6px 12px` padding, **12 px radius**, body/m **16/20** typography. Default and active must never receive a shared `min-width`; their width is text width + 24 px horizontal padding. The loading variant is the only empty state and is fixed to **57 px** wide. Active = white/on-color; default = surface; loading = `rgba(38,44,59,.6)` with the same **30 px white / 20% / 37.5 px blur** left→right blinking skeleton used by Card/Block. It does not use a spinner.
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.
- **Product rule:** scale-based pressed feedback is always `transform: scale(0.985)`.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Chip.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Chip.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
