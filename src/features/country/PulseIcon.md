# PulseIcon

**Source:** `src/features/country/PulseIcon.js`

## Purpose

Frame-driven pulse status icon.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `animationKey` | `0` |

## Invariants

- Preserve local frame assets/timing rather than replacing with a generic CSS pulse without approval.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/country/PulseIcon.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `PulseIcon.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
