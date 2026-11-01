# BittVPN checkout / payment prototype

## Core checkout

- Purchase/renewal duration proceeds to the existing Checkout screen.
- Extra devices, bonuses and all totals recalculate live from project pricing config.
- `Перейти к оплате` no longer acts as a dead CTA: it opens the payment-method BottomSheet.

## Payment-method step

Figma screen `7370:30600`, sheet `7370:32834`.

- Providers: ЮKassa, Robokassa, Енот.
- Exact 44×44 provider SVGs come from the product-owner supplied `Downloads.zip` and are stored locally under `src/assets/icons/payments/`.
- Provider rows reuse `Cell type="payment"` and local radio assets.
- ЮKassa is selected when the sheet opens.
- CTA copy is dynamic: `Оплатить N ₽`, using the live Checkout total.
- Offer caption remains below the CTA: `Оплачивая, ты принимаешь условия оферты`.

## Payment imitation

Figma `7370:33064`.

- `image 19(1).png` supplied by the product owner was converted losslessly to `src/assets/images/payment/ukassa-payment.webp`.
- The WebP is stretched edge-to-edge across the payment screen exactly as the design image layer is.
- Bottom live CTA is `Оплатить (Имитация)`.

## Result flow

- Simulation CTA reuses the existing `HistoryDetailScreen` waiting state `6128:23570` instead of creating a duplicate screen.
- The generated operation carries the Checkout location, total and selected payment service.
- The simulation screen is replaced in the stack by waiting state, so Telegram Back during this phase returns to Checkout.
- `Продолжить оплату` on this checkout-generated waiting state can reopen the same payment imitation screen.
- If waiting stays open, after **3000 ms** the same operation becomes `detailState='success'` and the existing `HistoryDetailScreen` success state `6128:23400` / `Оплачено` is shown in place.
- Leaving waiting before the timeout cancels that pending transition.
- Telegram Back from the checkout-generated paid/success result clears the payment draft and resets the app directly to Main.

## Shared component resync in this change

- `BottomSheet` `7166:122124`: one canonical shell for every flow — 44 px top, 20 px sides, 32 px direct-child gap, `20px + --app-action-safe-bottom` bottom, `rgba(22,26,32,.85)`, 11.2 px blur, 36 px top radii and square bottom corners.
- `AppTabBar` `5948:20739`: all CTA/navigation screens now use the same component-owned padding/wrapper/safe-area geometry; Checkout no longer carries a local tabbar layout override.
- `Cell`: payment selected/default masters `7370:32485` / `7370:32431` are supported through the shared component rather than a local row clone.

No runtime assets are loaded from temporary Figma/MCP URLs.
