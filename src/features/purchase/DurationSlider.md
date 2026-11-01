# DurationSlider

**Source:** `src/features/purchase/DurationSlider.js`

## Purpose

Interactive six-step subscription-duration selector.

## Figma source

- Component set: `7166:121702` — `data slider`.
- States: `one / two / three / four / five / six`.
- Purchase-screen examples: `7166:122710` and `7171:123296`.

## Props / API

| Prop | Contract |
| --- | --- |
| `value` | integer 1–6 |
| `onChange` | controlled value update |

## Geometry

- Component is natural-flow content, not an absolutely positioned screen-specific slider.
- Value badge: HUG width, **32 px** high, white, 999 radius, body/s **14/18**, `7px 12px` outer padding plus the Figma label wrapper, centered over the selected knob.
- Badge → track gap: **12 px**.
- Track outer box is **46 px** high: six internal point cells are 44 px high and the 1 px border sits outside that content geometry in the current Figma component. Surface fill, tertiary/15% border, 9999 radius, 24 px horizontal point inset.
- Six point cells are equal; dots are 12×12 elevated.
- Filled layer starts at x=-1/y=-5. Gradient is 46 px high; knob is **12×52**.
- Anchor geometry is measured from the rendered dots, so responsive widths preserve the Figma state alignment instead of hard-coding 362 px offsets.

## Interaction

- Dragging the track selects the nearest month.
- The value badge is itself draggable and maintains its grab offset, so it does not jump when grabbed off-center.
- Keyboard: arrows, Home, End.
- Existing controlled interaction must remain usable both by knob/track and value badge.

## Pricing

- Slider owns only month selection. Discounts/prices remain sourced from `config/pricing.js`; illustrative amounts in individual Figma screen snapshots do not become duplicated literals here.

## Documentation update rule

Update this file whenever geometry, interaction, state range or Figma source changes.
