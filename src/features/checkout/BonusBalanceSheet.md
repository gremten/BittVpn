# BonusBalanceSheet

**Source:** `src/features/checkout/BonusBalanceSheet.js`

## Purpose

Checkout information BottomSheet opened from the primary info glyph beside `бонусный баланс`.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Screen/state: `7223:25096` — `t-country | purchasing | all options`
- Sheet instance: `7223:25222`
- Sheet data: `7239:25567`

Telegram/iOS header and Home Indicator visible in Figma are host chrome and are not rendered by product DOM.

## Props / API

| Prop | Contract |
| --- | --- |
| `open` | controlled by `CheckoutScreen` |
| `onClose` | controlled by `CheckoutScreen` |

## Verified layout

- Reuses shared `BottomSheet`; black 40% overlay, glass surface, grabber and drag-to-close remain owned by the shell.
- Content uses 20 px sheet side insets inherited from `BottomSheet`.
- Top clearance is 44 px through the shared sheet shell.
- This instance explicitly passes `bottomSafeArea="stacked"`: bottom clearance is `32 px + system safe bottom` (66 px on the 34 px iOS reference safe area); no fake Home Indicator is rendered. This additive mode is specific to the info-sheet geometry and must not leak into the purchase-duration action sheet.
- Heading is Martian Grotesk 16/20 medium.
- Heading → table gap: 24 px.
- Table: 19.49 px marker column + 12 px gap + flexible cell column.
- Reuses the durable referral dotline/dot SVG assets because Figma references the same `6994:113312` / `6994:113277` primitives.
- Rows are 56 / 56 / 40 px, with 12 px gaps; title 16/20 and caption 12/16.
- Separators are 1 px `border/primary` at 15% between the first two rows only.

## Content

- Heading and accessibility label: `Что такое бонусный баланс?`.
1. `Используй при оплате` — `Бонусами можно покрыть всю стоимость`
2. `Пополняется с покупок друзей` — `Начисляется 5% с каждой их покупки`
3. `Только внутри BittVPN` — `Вывести или обменять на деньги нельзя`

## Documentation update rule

Update this file whenever sheet content, geometry, source node, safe-area behavior or open/close interaction changes.
