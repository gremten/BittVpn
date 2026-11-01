# Ping

**Source:** `src/components/ui/internal/Ping.js`

## Purpose

Internal ping value + animated/status dot primitive.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `value` | numeric ping; may be null when `label` is used |
| `label` | optional status text such as `Техработы` |
| `level` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |

## Invariants

- Keep level inference and visual status consistent across cards.
- `label` reuses the same dot + 12/16 text geometry and replaces the numeric `${value} мс` copy.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/internal/Ping.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Ping.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Offline state

- `level="offline"` is the current Main technical-work treatment from `6429:29217`.
- Dot and label use `#9499A1`; dot is static (no blinking).
