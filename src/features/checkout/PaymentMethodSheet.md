# PaymentMethodSheet

**Source:** `src/features/checkout/PaymentMethodSheet.js`

## Purpose

Checkout overlay for choosing the payment provider after the user taps `Перейти к оплате`.

## Figma source

- Screen state: `7370:30600` — `t-country | purchasing | payment method`.
- Concrete BottomSheet: `7370:32834`.
- Payment data: `7370:32833`.
- Selected payment Cell master: `7370:32485`.
- Default payment Cell master: `7370:32431`.
- CTA group: `I7370:32834;7297:35166`.
- Offer sublabel: `I7370:32834;7370:31794`.

## Assets

Provider icons come only from the product-owner supplied `Downloads.zip` and are committed locally:

- `src/assets/icons/payments/ukassa.svg`
- `src/assets/icons/payments/robokassa.svg`
- `src/assets/icons/payments/enot.svg`

Do not replace these with temporary Figma/MCP URLs.

## Layout / interaction

- Shared `BottomSheet` shell; this is overlay state inside Checkout, never an App route.
- Sheet content uses 20 px sides through the shared shell, 44 px top padding and a 32 px data→actions gap.
- Header is Martian Grotesk 16/24 medium.
- Provider list uses `Cell type="payment"`; rows are 56 px except the final 44 px row because the final row has no separator tail. Rows have 12 px gaps.
- Provider icon is 44×44; radio is 24×24; copy is 16/20 + 12/16 secondary.
- `ЮKassa` is selected whenever the sheet opens. Tapping another row only changes the selected provider.
- CTA is the shared large primary circular `Button`, with live Checkout total: `Оплатить N ₽`.
- CTA proceeds to the payment-imitation screen with the selected provider payload.
- Offer copy sits 4 px below the CTA and keeps the `условия оферты` fragment underlined.
- The concrete reference reserves 34 px at the bottom for the iOS Home Indicator. Product DOM does not draw the indicator; the sheet uses that region as safe clearance only.

## Documentation update rule

Update this file together with the source whenever payment providers, assets, selection behavior, CTA copy/price ownership, geometry, Figma nodes or navigation handoff change.
