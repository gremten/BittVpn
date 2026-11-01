# SingleSelectChipGroup

**Source:** `src/components/ui/SingleSelectChipGroup.js`

## Purpose

Single-select group built from Chip.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6436:32518` — `group single select chip`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `options` | `[]` |
| `selected` | `'none'` |
| `onChange` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |


## Verified Figma sizing

- Variant set: `6436:32518`; each selected-state component is horizontal Auto Layout with **HUG/HUG** sizing and **8 px** item spacing.
- The group itself must be `max-content`/HUG. It must not stretch its chips to fill available width and must not own the screen's horizontal-scroll viewport.
- Each child `Chip` is also HUG. Screen-specific overflow is implemented by a wrapper around the group when needed.

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/SingleSelectChipGroup.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `SingleSelectChipGroup.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
