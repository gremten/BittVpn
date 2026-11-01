# LegacyTabBar

**Source:** `src/components/ui/LegacyTabBar.js`

## Purpose

Legacy tabbar implementation retained for compatibility.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `4745:134` — `tabbar`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `selected` | `'home'` |
| `property1` | `required/controlled by caller` |
| `onSelect` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- Prefer the current Navigator/AppTabBar on new work unless an existing screen explicitly uses this component.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/LegacyTabBar.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `LegacyTabBar.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
