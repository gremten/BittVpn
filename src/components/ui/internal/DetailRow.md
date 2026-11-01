# DetailRow

**Source:** `src/components/ui/internal/DetailRow.js`

## Purpose

Internal locked-design primitive for detail rows.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `label` | `required/controlled by caller` |
| `value` | `required/controlled by caller` |
| `children` | `required/controlled by caller` |
| `end` | `false` |
| `valueTone` | `'primary'` |
| `className` | `required/controlled by caller` |

## Invariants

- Internal primitive: do not export as a new public design-system family without a reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/internal/DetailRow.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `DetailRow.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
