# Duration discounts

## Current visual references

- Data Slider component: `7166:121702`
- Purchase sheet data: `7166:122079`
- BottomSheet component: `7166:122124`
- Current purchase overlay examples: `7166:122710` and `7171:123296`

The new visual composition shows the final CTA price plus the discount badge. The purchase sheet no longer supplies a struck/original price to the CTA.

## Pricing source of truth

The runtime discount curve remains centralized in `src/config/pricing.js`; individual Figma screen amounts are illustrative screen content and are not duplicated into slider/layout code.

| Months | Discount |
|---:|---:|
| 1 | 0% |
| 2 | 0% |
| 3 | 14% |
| 4 | 18% |
| 5 | 22% |
| 6 | 26% |

`calculateAccessPricing()` remains the single source of truth for duration-sheet and checkout totals.
