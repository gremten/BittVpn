# PurchaseDurationSheet

**Source:** `src/features/purchase/PurchaseDurationSheet.js`

## Purpose

Available-country purchase duration content composed inside the shared BottomSheet. `RenewAccessSheet` is a thin wrapper around this same component and changes only the renewal heading/accessibility/Figma metadata, so the two flows cannot drift.

## Figma source

- Locked purchase-sheet data composition: `7166:122079` — `🔒 bs data buying slider`.
- Shared slider: `7166:121702`.
- Shared BottomSheet shell: `7166:122124`; current discount instance: `7171:123356`.
- Screen examples: `7166:122710` (1 month) and `7171:123296` (discount state).

## Props / API

| Prop | Contract |
| --- | --- |
| `open` | sheet visibility |
| `pricePerMonth` | current country base price |
| `onClose` | close overlay |
| `onProceed` | continue with selected month count |
| `title` | optional heading override; purchase default is `На какой срок оформим доступ?` |
| `ctaPrefix` | optional CTA verb/prefix; purchase default is `Оформить за` |
| `ariaLabel` | optional accessibility label override |
| `figmaNode` | optional concrete BottomSheet Figma node metadata |
| `dataFigmaNode` | optional locked slider-data Figma node metadata |

## Layout / behavior

- Heading → slider gap is **20 px**.
- Purchase-data area and CTA are separated by **32 px**. The CTA group keeps the Figma **76 px** slot with the 56 px button aligned to its top.
- The purchase sheet explicitly uses `bottomSafeArea="tabbar"`. Its 76 px ButtonGroup contains a 56 px button plus a 20 px tail, while the sheet contributes `--app-action-safe-bottom = max(32px, app safe area)`. Therefore button-bottom → viewport-bottom is always **20 px + max(32px, app safe area)**. On the 34 px iOS Figma reference (`7171:123356`) this is 54 px; when Telegram reports safe-bottom as 0, it remains 52 px instead of dropping to 20 px. The closed purchase/renew CTA uses the same physical baseline.
- Opening the duration sheet resets selection to **1 month** for both purchase and renewal. A non-1-month position shown in a Figma example is only an example state, not the opening default.
- The CTA remains the existing large primary circular `Button` and uses the shared pricing calculation. Purchase defaults to `Оформить за N ₽`; renewal overrides only the prefix to `Продлить за N ₽`.
- When a discount exists, the current screen treatment shows the discount pill beside the final CTA label; this sheet no longer passes an old/struck price into the button.
- Do not duplicate the BottomSheet overlay/grabber/safe-area mechanics here.

## Documentation update rule

Update this file whenever purchase-sheet composition, pricing presentation or Figma source changes.

- Shared BottomSheet has no product-side bottom corner radius. The real mobile viewport/device clipping supplies physical bottom rounding; this avoids fake rounded lower corners on desktop.
