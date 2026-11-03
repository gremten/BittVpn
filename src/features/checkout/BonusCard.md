# BonusCard

**Source:** `src/features/checkout/BonusCard.js`

## Purpose

Checkout card for applying referral/bonus balance.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `enabled` | `required/controlled by caller` |
| `onChange` | `required/controlled by caller` |
| `onInfo` | opens the bonus-balance information BottomSheet |
| `infoOpen` | `false`; mirrors sheet state for `aria-expanded` |

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/checkout/BonusCard.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `BonusCard.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Deduction label rule (product decision 2026-11-03)

- The second SegmentedControl option reads `Списать N ₽`, where **N = min(bonus balance, order sum)** from `calculateBonusDeduction()` in `src/config/pricing.js`. The full balance is **not** shown on checkout; the label always equals the amount that will actually be deducted.
- N is recomputed whenever the order sum changes (duration, extra devices).
- `CheckoutScreen` does not render `BonusCard` at all when N is 0 (no balance).
- When N covers the whole order the total becomes 0 ₽; the 0 ₽ payment path (skip the payment-method sheet, CTA «Оплатить бонусами») is a separate pending change — not implemented yet.
- New prop: `maxDeduction` (number, required) — the N above.
- Figma copies with this label: `7823:29153`, `7823:29191`, `7823:29232` (page «🛠️ Userflow и прототипирование», «ред. 2»).

## Current Figma behavior

- Current checkout reference is `7223:25096`.
- Heading is `бонусный баланс`.
- The 16×16 `icn_s_circle-info` glyph is **icon/action/primary / white**. The implementation forces the durable local icon to primary white and does not apply a gray/secondary opacity.
- The glyph sits inside a transparent 24×24 button so the visual geometry remains the Figma 16 px icon while the interaction target is usable. The button has no filled pressed state.
- Tapping it opens `BonusBalanceSheet`; the button exposes `aria-haspopup="dialog"` / `aria-expanded`.
