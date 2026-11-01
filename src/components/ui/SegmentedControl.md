# SegmentedControl

**Source:** `src/components/ui/SegmentedControl.js`

## Purpose

Segmented control with drag/tap selection.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `options` | `required/controlled by caller` |
| `value` | `required/controlled by caller` |
| `onChange` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |
| `ariaLabel` | `'Переключатель'` |

## Current Figma geometry

- Current checkout instance from `7223:25096` is 52 px high: 4 px outer padding around 44 px slots.
- Outer control radius is **16 px**.
- Slot and active-pill radius is **12 px**.
- Background remains page `#0A0C0F`; active pill remains elevated `#242A33`.
- Existing drag/tap slot-catching behavior is preserved; only the visual geometry was resynced.

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- Preserve current pointer thresholds and touch behavior unless explicitly redesigned.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/SegmentedControl.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `SegmentedControl.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
