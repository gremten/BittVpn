# CountryScreen

**Source:** `src/screens/CountryScreen/CountryScreen.js`

## Purpose

Single Country detail DOM state covering both not-yet-purchased access and purchased-access variations.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Available/purchase-entry base: `6643:24352`
- Purchased active/no-limit variation: `7261:26032` (content `7261:26033`)
- Purchased limit-at-capacity variation: `6447:27934` (content `6447:27935`)
- Purchased expiring-extra-slot below-capacity variation: `6502:41574` (devices `6502:41582`)
- Purchased technical-works variation: `6520:46426` (content `6520:46427`)
- Current purchase-overlay references:
  - `7166:122710` — `t-country | in purchasing`
  - `7171:123296` — `t-country | in purchasing | discount`
- Purchased renewal overlay: `7353:28234` — `t-country | purchased | new period`; BottomSheet `7353:30359`, renewal data `7353:30358`.
- Current specifications detail: `7172:124235`.
- Current included-device-slots info state: `7181:25029`.
  - Card: `7181:25036`.
  - Overlay: `7335:28670`.
  - Informational BottomSheet: `7335:28673` / data `7335:28672`.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `location` | required/current location |
| `deviceCount` | App/session-owned live device count for the selected purchased location |
| `onDeviceCountChange` | updates App/Main when the Country device list changes |
| `onCheckout` | App-owned nested checkout navigation |
| `onOpenSpecifications` | App-owned nested specifications navigation |

## Layout / interaction

- Product content uses **20 px** horizontal insets at the 402 px reference width and 24 px section gaps.
- Included slots use the shared `Card` family from `7181:25036`: 16 px padding/radius, 12 px icon gap, exact local `icn_m_devices.svg`. Tapping/clicking this Card opens the in-screen `SlotsInfoSheet` (`7335:28673`) with the three dotline explanation rows from `7181:25029`.
- `/характеристики` exposes two equivalent entry points to the full specification screen: compact `Все` and the characteristics Block itself.
- The characteristics Block is clickable but does **not** add a card-scale pressed animation. Its padding is **16 px on top/left/right and 20 px on the bottom**.
- Purchase duration, purchased renewal, and included-slots information are overlay BottomSheets on the same Country screen. The shared BottomSheet owns their 40% black overlay; none of these states adds an App route.
- While a duration sheet is open **both available purchase and purchased renewal tabbars are hidden**. Available access uses `PurchaseDurationSheet`; purchased access uses `RenewAccessSheet` (`7353:30359`). Shared BottomSheet also layers at 55/56 above AppTabBar 50 as a safety invariant; the country content remains mounted under the overlay.
- Telegram/system header and Home Indicator shown in Figma are host chrome and are never reproduced in DOM. Country synchronizes native sheet chrome while either the purchase-duration or slots-information sheet is open.

## Documentation update rule

Update this file whenever Country layout, purchase-overlay behavior, characteristics navigation, props or Figma references change.

## Access-state model

`location.accessState` selects presentation inside the **same `CountryScreen`**:

| state | Figma | behavior |
| --- | --- | --- |
| `available` | `6643:24352` | existing SlotsNotice + ideal choice + characteristics + `Купить доступ` |
| `active` | `7261:26032` | active-access stats + `/мои устройства` + characteristics + `Продлить доступ` |
| `limit` at capacity | `6447:27934` | `6/6` warning counter + warning notice + `Увеличить лимит` |
| `limit` below capacity, extra slot expiring | `6502:41574` | e.g. `5/6`: no upgrade CTA, primary-white warning counter, surface expiry notice; follows device deletion while the notice remains open |
| `maintenance` | `6520:46426` | technical-work notice, `Не в сети`, no map ping, latency `—`, device list |

Do **not** add `SCREEN.COUNTRY_LIMIT`, `SCREEN.COUNTRY_MAINTENANCE`, etc. App still pushes only `SCREEN.COUNTRY`; the selected location payload owns its variation.

Purchased variations reuse the same specifications navigation. `Продлить доступ` opens `RenewAccessSheet`, which is intentionally the same duration modal as `PurchaseDurationSheet`: it resets to 1 month, keeps the same slider/pricing/CTA behavior and changes only the heading to `На какой срок продлить?`. Proceed continues through the existing Checkout route.

The device count/list is driven from location state so entering from a Main card preserves that location rather than showing a second hard-coded Germany screen.

## Module export

- `src/screens/CountryScreen/index.js` re-exports the default `CountryScreen`, `COUNTRY_SCREEN_FIGMA_NODES`, `COUNTRY_PURCHASED_NO_DEVICES_FIGMA_NODE`, `COUNTRY_LIMIT_EXPIRY_BELOW_CAPACITY_FIGMA_NODE`, and `getCountryScreenFigmaNode`; App resolves the live Figma reference through that barrel.

## Limit warning visuals

- At capacity, warning source assets remain `#FFC300`; compact `6/6` text + 16 px icon render at **75%** as in `6447:27943`, and the notice stays `bg/warning #27210E` with a full-strength yellow 24 px warning glyph (`6521:49043`).
- After deleting one device from the expiring-slot location, `used < limit` selects Figma `6502:41574`: the xsmall outlined counter keeps the warning glyph but returns its content/border to primary-white/default outlined treatment (`6502:41583`), the `Увеличить лимит` CTA is absent, and the expiry notice uses `bg/surface #161A20` with primary-white icons (`6521:49029`). The copy stays `Завтра лимит уменьшится на 1` before and after the delete; only the visual state changes.
- The below-capacity state is still the same `accessState=limit` Country route/state family; it is selected from the live device count, never by adding another App route.
- Warning dismissal is an animated inline removal, not a hard hide: the Card fades upward while shrinking to `0.97` over 300 ms and its layout slot collapses over 360 ms. The overlapping timings keep the content below moving continuously instead of snapping. Reduced-motion preferences are respected.
- Capacity and warning are independent: `used >= limit` shows `Увеличить лимит`, while the warning treatment is reserved for the separate temporary-extra-slot expiry scenario.

## Device delete flow

Purchased Country variations keep device selection/context/delete state inside the existing `PurchasedDevices` feature; this is **not another App screen/route**.

- `PurchasedDevices` temporarily owns the bottom action while selection mode, context menu, delete confirmation/pending/success is active.
- `PurchasedCountry` hides `Продлить доступ` while the device feature owns that area, preventing two fixed tabbars from stacking.
- Selection delete mode renders the shared danger `AppTabBar type="action"`; context/single-delete hides renewal while its overlay/sheet owns the bottom UI and does not create a third fake tabbar type.
- Device confirmation/success remains a shared BottomSheet overlay on the same Country DOM screen.
- When deletion succeeds, each removed device Card fades upward (`-16 px`), scales to `0.96`, and fades out over 320 ms. The remaining device Cards animate their layout upward at the same time via Motion `popLayout`, so the list never hard-collapses after the exit.

## Device delete success

Device deletion success remains in-screen BottomSheet state inside `PurchasedDevices`; it is not a route. The success sheet uses the corrected exact-product check endpoint and closes after 3 seconds.
## Shared bottom surfaces

Country does not own AppTabBar/BottomSheet outer geometry. Purchase, renewal and device-selection reuse the shared shells; only inner button/content styling may vary. Country keeps its established screen-owned bottom content reserve (`purchase-tabbar-height + content-tabbar-gap + app-safe-bottom`).
