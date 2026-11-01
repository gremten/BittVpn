# CheckoutScreen

**Source:** `src/screens/CheckoutScreen/CheckoutScreen.js`

## Purpose

Checkout/purchasing screen DOM state.

## Figma sources

- Base checkout: `6606:23733`.
- Current all-options + bonus-info state: `7223:25096`.
- Bonus-information sheet: `7223:25222`; content `7239:25567`.
- Payment-method overlay state: `7370:30600`.
- Payment-method sheet: `7370:32834`.

File: `5ks9FYkDbV4fcg60G4SLjf`, page `🛠️ Userflow и прототипирование`.

## Props / API

| Prop | Ownership |
| --- | --- |
| `location` | App-selected location |
| `months` | duration chosen in purchase/renewal sheet |
| `onStartPayment` | App callback receiving the confirmed payment draft and pushing payment imitation |

## State ownership

`CheckoutScreen` owns:

- extra-device count;
- bonus usage;
- bonus-info BottomSheet visibility;
- payment-method BottomSheet visibility.

The live total is always calculated from the same access/extras/bonus state used by the visible breakdown. That exact total is passed to `PaymentMethodSheet`; no payment price is hardcoded from the Figma sample.

## Payment flow

1. `CheckoutTabBar` CTA `Перейти к оплате` opens `PaymentMethodSheet` in-place.
2. The sheet defaults to ЮKassa; choosing another `Cell type="payment"` only changes selection.
3. `Оплатить N ₽` closes the sheet and calls `onStartPayment` with provider, live total, duration, location and extra-device data.
4. App pushes `PaymentSimulationScreen` (`7370:33064`).

This sheet is overlay state, not a route. While either checkout sheet is open, `syncTelegramChrome(true)` is active; closing/unmount restores normal chrome.

## Styling

- `src/screens/CheckoutScreen/CheckoutScreen.css`.
- Keep order summary, extras/bonuses and final total coherent with `src/config/pricing.js`.
- Existing Checkout tabbar remains mounted under overlay/sheet and is covered by shared BottomSheet z-order.

## Before changing this

1. Read `/AGENTS.md` and `src/App.md`.
2. Read `CheckoutTabBar.md`, `PaymentMethodSheet.md`, `BottomSheet.md`, and `Cell.md`.
3. Preserve internal-screen navigation; do not create external routes for provider selection.

## Documentation update rule

Update this file whenever Checkout state, pricing ownership, payment-method overlay, App handoff, props or Figma sources change.
## Shared bottom surfaces

Checkout uses canonical `AppTabBar type="action"` and the shared BottomSheet shell. Checkout keeps its established screen-owned bottom content reserve (`purchase-tabbar-height + content-tabbar-gap + app-safe-bottom`) and does not override either shell.
