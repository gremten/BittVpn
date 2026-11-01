# RenewAccessSheet

**Source:** `src/features/purchase/RenewAccessSheet.js`

## Purpose

Purchased-country renewal BottomSheet opened by the fixed `Продлить доступ` action. It is an in-screen overlay state of `CountryScreen`, not a separate App route.

## Figma source

- Full Country renewal state: `7353:28234` — `t-country | purchased | new period`.
- BottomSheet instance: `7353:30359`.
- Locked renewal slider data: `7353:30358` — `🔒 bs data buying slider`.

## Behavior

- Renewal intentionally uses **the exact same duration modal behavior as ordinary purchase**.
- The renewal selector keeps the purchase mechanics and overrides only renewal-specific copy.
- Opening the sheet resets the slider to **1 month**, exactly like `PurchaseDurationSheet`.
- Heading: `На какой срок продлим доступ?`.
- CTA prefix: `Продлить за`, producing `Продлить за N ₽`.
- Slider scale, selected-value pill, pricing, discount pill, CTA layout, BottomSheet surface, spacing, safe-area handling and interactions still come directly from `PurchaseDurationSheet`.
- Do not introduce a renewal-specific default month, CTA copy, slider behavior or visual treatment. Figma may show a particular slider position as an example state; that position is not the opening default.
- Proceed closes the sheet and continues through the existing Checkout flow.

## Implementation rule

`RenewAccessSheet` is deliberately a thin wrapper around `PurchaseDurationSheet`. Keep it that way so purchase and renewal cannot visually or behaviorally drift apart. Renewal may override Figma metadata and accessibility label, but not purchase mechanics.

## Documentation update rule

Update this file whenever renewal heading, Figma source, or its relationship to `PurchaseDurationSheet` changes.
