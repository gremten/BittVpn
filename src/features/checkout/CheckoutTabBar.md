# CheckoutTabBar

**Source:** `src/features/checkout/CheckoutTabBar.js`

## Purpose

Checkout bottom CTA/tabbar.

## API

| Prop | Ownership |
| --- | --- |
| `onPayment` | CheckoutScreen callback that opens `PaymentMethodSheet` |

The CTA remains `Перейти к оплате` and uses the shared large primary circular `Button` inside `AppTabBar type="action"`. Checkout has no local tabbar padding/height/background/radius overrides; all outer geometry is component-owned.

## Navigation role

The button does not navigate directly. It opens the in-screen payment-method BottomSheet (`7370:30600` / `7370:32834`). The selected provider and live total are confirmed inside that sheet before App pushes the payment-imitation screen.

## Before changing this

1. Read `/AGENTS.md`.
2. Read `CheckoutScreen.md` and `PaymentMethodSheet.md`.
3. Preserve the shared Button/AppTabBar components.

## Documentation update rule

Update this file in the same change whenever CTA copy, callback behavior, visual variant or payment-flow ownership changes.
