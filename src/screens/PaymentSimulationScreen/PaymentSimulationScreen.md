# PaymentSimulationScreen

**Source:** `src/screens/PaymentSimulationScreen/PaymentSimulationScreen.js`

## Purpose

Prototype payment-provider page shown after the user confirms a provider in `PaymentMethodSheet`.

## Figma source

- Screen: `7370:33064` — `t-safari | ukassa`.
- Background image rectangle: `7370:33327`.
- Bottom action tabbar: `7370:33292`.

## Asset contract

- Runtime image is `src/assets/images/payment/ukassa-payment.webp`.
- It is a lossless WebP conversion of the product-owner supplied `/image 19(1).png` (402×872).
- Do not download/replace it from Figma/MCP. The supplied image is the approved source.
- The image is stretched to the entire live app viewport (`width/height: 100%`, `object-fit: fill`) because the Figma image itself fills the 402×874 frame behind the bottom action surface.

## UI

- No extra browser/Telegram chrome is drawn in product DOM; the supplied screenshot already contains the intended payment-page artwork and native host chrome remains host-owned.
- The only live product control is the bottom `AppTabBar` with large primary `Оплатить (Имитация)` button.
- The payment CTA uses the shared `AppTabBar type="action"` **without screen-specific spacing/height overrides**. Its glass surface is `rgba(22,26,32,.8)` with 11.2 px blur and 36 px top corners only; bottom corners are square, matching the current shared tabbar component.

## Navigation

- App pushes this screen from Checkout after the payment-method CTA.
- `Оплатить (Имитация)` converts the current Checkout draft into the existing `HistoryDetailScreen` `waiting` state (`6128:23570`).
- The simulation screen is replaced by the waiting detail in the internal stack, so Back during the waiting phase returns to Checkout instead of reopening the simulated provider page.
- If the user stays on that checkout-generated waiting detail, App automatically changes the same operation to `success` after **3000 ms**, reusing existing `HistoryDetailScreen` Figma state `6128:23400` / `Оплачено`. That screen performs a 450 ms timer-dot → check morph plus a soft success copy/body entrance instead of hard-swapping the result.
- The waiting screen's `Продолжить оплату` action replaces the waiting entry with this simulation screen again for the same checkout draft and cancels the pending auto-success timer.
- Back from the resulting checkout-generated `Оплачено` state resets the internal navigation stack directly to Main.

## Documentation update rule

Update this file whenever the supplied image, Figma node, CTA surface, navigation handoff or sizing behavior changes.
