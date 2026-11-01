# ExtraDevicesCard

**Source:** `src/features/checkout/ExtraDevicesCard.js`

## Purpose

Checkout control for additional device slots.

## Props / API

| Prop | Contract |
| --- | --- |
| `count` | controlled extra-slot count |
| `onChange` | controlled count update |

## Invariants

- Country access includes 5 slots; extra slots are paid additions.
- The paid extra-device stepper is limited to **0–5 additional devices**. At 5, the plus control is disabled and further increments are clamped.
- Both the unit caption and calculated total use shared `EXTRA_DEVICE_PRICE`; never duplicate the price literal in copy.
- Current Country characteristics reference shows **99 ₽ / month**, so the shared pricing constant is 99 ₽ and Checkout follows it automatically.

## Documentation update rule

Update this file whenever price sourcing, limits or interaction changes.

## Maximum-stepper visual state

At `count = 5`, the plus `IconButton` is both functionally disabled and visually disabled. Its plus glyph uses the shared Figma `icon/action/disabled` color `#9499A1`; the stepper must not merely block the click while leaving a white plus visible.
