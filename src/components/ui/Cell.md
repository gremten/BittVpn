# Cell

**Source:** `src/components/ui/Cell.js`

## Purpose

Reusable cell family. Existing order/bonus cells keep the historical API, and the current checkout flow also uses the payment-method cell variant.

## Figma sources

- History/order family: `6432:30801` — `cell`.
- Payment selected master: `7370:32485`.
- Payment default master: `7370:32431`.
- Concrete payment sheet: `7370:32833` inside screen `7370:30600`.

## Props / API

### Existing order/bonus cell

| Prop | Default / ownership |
| --- | --- |
| `type` | `'order'`; existing values `order`, `bonus` |
| `state` | `'in processing'` |
| `title` | caller |
| `description` | caller |
| `value` | caller |
| `icon` | caller |
| `className` | caller |

### Payment cell

Use `type="payment"`.

| Prop | Ownership |
| --- | --- |
| `title` | payment provider name |
| `description` | provider methods, currently `Банковская карта • СБП` |
| `icon` | exact local 44×44 provider SVG |
| `selected` | controls 24×24 radio-on/off glyph |
| `last` | removes the separator tail and makes the final row 44 px high |
| `onClick` | changes provider selection in the parent sheet |

## Payment geometry

- Bare transparent list row; no card background/padding.
- Icon: **44×44**.
- Icon→content gap: **12 px**.
- Copy: body **16/20**, caption **12/16** at 50% white, 4 px internal gap.
- Radio: **24×24**, exact existing local dot-matrix radio assets.
- Selected/default rows with separator are **56 px** high: 40 px content + 15 px tail + 1 px `border/primary` at 15%.
- Final row has no separator/tail and is **44 px** high.
- Payment row pressed scale follows the project-wide **0.985** rule.

## Styling

- `src/components/ui/bitt-ui.css`.
- Payment provider art is supplied by the feature through `icon`; Cell never reaches Figma/MCP at runtime.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and `src/components/ui/Cell.js`.
3. For payment changes inspect `7370:32485` / `7370:32431` and `PaymentMethodSheet.md`.
4. Preserve the existing order/bonus API while changing payment behavior.

## Documentation update rule

Update this file in the same change whenever Cell API, variants, geometry, payment radio behavior, assets or Figma sources change. Update the parent flow docs when the change affects Checkout/History.

## Payment cell interaction

- Payment-method cells (`type="payment"`) have **no pressed visual state** in Figma.
- Tapping a payment row may change its selected radio state, but the row itself must not scale, shift, recolor, or add a pressed fill on `:active`.
