# LocationCardData

**Source:** `src/components/ui/internal/LocationCardData.js`

## Purpose

Internal composition primitive for LocationCard data layouts.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `state` | `'available'` |
| `...props` | `forwarded` |

## Invariants

- Mirrors locked Figma primitives; changes must be validated through LocationCard variants.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/internal/LocationCardData.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `LocationCardData.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Current acquired-location states

- Default current data: secondary device usage + optional ping/status + expiry.
- `limited=true`: device usage uses the compact warning-toned text treatment. Main intentionally omits the old leading warning glyph.
- `pingLabel` is used for the Main technical-works card (`Техработы`) while retaining the shared Ping dot treatment.

## Current purchased-state variants

- Main current-card data follows `5335:15751`.
- Current-card control has **no literal bullet separator** between device usage and Ping. The single visible dot is owned by `Ping` itself.
- Limited current state: warning-colored device usage only, then the high Ping control; there is no leading warning icon on Main.
- Maintenance: ordinary device usage followed by `Ping level="offline"` / `Техработы`; because there is no extra separator, only one offline dot is visible.

## Available variant

- Current source: `5335:15752`, used by card instance `5335:16084`.
- Price Button is top-aligned within the 44 px top row.
- Bottom wrapper has 52 px left padding, then a 1 px separator, then 8 px to the 12/16 metadata bar.
- Separator rhythm is 2 px visible segment / 2 px transparent gap at `rgba(233,240,243,.2)`; never replace it with native CSS `dotted` border.
