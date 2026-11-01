# CheckboxLabel

**Source:** `src/components/ui/CheckboxLabel.js`

## Purpose

Checkbox + label design-system control.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6466:33667` — `checkbox label`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `state` | `'default'` |
| `checked` | `required/controlled by caller` |
| `onChange` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |
| `ariaLabel` | optional accessible label for icon-only checkbox usage |
| `disabled` | `false` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/CheckboxLabel.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `CheckboxLabel.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Icon-only selection

Country device delete mode uses the checkbox with no visible label. When `children` is absent, no empty text span is rendered, so the 24×24 control keeps exact Figma geometry without an extra 8 px gap.
