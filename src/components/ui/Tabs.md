# Tabs

**Source:** `src/components/ui/Tabs.js`

## Purpose

Shared two-state tab item for the Locations screen.

## Figma source

- Component set: `7435:37032` — `tabs`, states `default | active`.
- Active master: `7435:37022` — `_/ 🔒master tab`.
- Current screen instances: purchased `7435:36711`, available `7435:37052`.

## API

| Prop | Meaning |
| --- | --- |
| `label` | Visible tab label. |
| `state` | `default` or `active`. |
| `onClick` | Selects the tab. |
| `className` | Optional additive class only; screen code must not replace the component geometry. |

## Geometry / visual rules

- The screen gives each tab one half of the 362 px tab row; the label/indicator stay centered inside that half.
- Height: **32 px**.
- Label: Martian Grotesk, 16/24, medium.
- Default label: white at 50% opacity.
- Active label: white.
- Active indicator: **48 × 1 px**, centered at the bottom edge.
- Default has no visible indicator.
- Figma does not define a pressed surface/scale state for this component. Do not add one.

## Accessibility

`Tabs` is a semantic `button` with `role="tab"` and `aria-selected`. The parent screen owns `role="tablist"` and the corresponding tab panel.

## Documentation update rule

If `Tabs.js` changes in states, geometry, typography, interaction, Figma mapping, or public props, update this file in the same change.
