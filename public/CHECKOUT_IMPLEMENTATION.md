BittVPN checkout screen implementation

Figma: 6606:23733

Flow:
- Open purchase bottom sheet from the country screen.
- Choose 1–6 months.
- Tap "Оформить за … ₽".
- The app switches to the checkout screen and keeps the chosen duration/price.
- Telegram native BackButton returns to the country screen.

Checkout interactions:
- Extra devices start at 0. Tapping + adds one and reveals a compact +/- stepper.
- Extra device price: 69 ₽ per device per month.
- Bonus selector toggles 100 bonus rubles.
- Total and breakdown recalculate live.

Design adaptation:
- Uses the existing Telegram fullscreen/safe-area shell; no simulated iPhone status bar or Home Indicator.
- Keeps the current 16 px content gap below the Telegram header and 16 px side paddings.
- Bottom CTA has 20 px design safety padding plus the real system safe area.
- +, -, info icons come from the user's local icon pack.
- The dotted payment separator is an exact local SVG export from Figma.

The Figma sample numbers are internally inconsistent (e.g. total vs breakdown), so this implementation keeps the existing product pricing (320 ₽/month) and makes the checkout math coherent/dynamic instead of hardcoding the sample values.
