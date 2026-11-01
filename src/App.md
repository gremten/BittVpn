# App

**Source:** `src/App.js`

## Purpose

Application state/orchestration root for the Telegram Mini App.

## Invariants

- Screens are DOM/React state inside one app; do not replace this with separate HTML pages or routes unless explicitly requested.
- The internal screen stack owns Back behavior for nested/detail flows; Telegram BackButton must pop that same stack.
- Main, Locations, Country, CountrySpecifications, Checkout, PaymentSimulation, Profile, Referral, History and HistoryDetail remain independently rendered screen components.
- Main, Locations and Profile are primary Navigator roots. Switching among them replaces the root state instead of pushing history, and Telegram BackButton stays hidden on all three so the host Close control does not turn into Back/app-name chrome. History is a nested Profile detail: Profile `Все` → History pushes the internal stack. Tapping an operation pushes HistoryDetail, so the nested chain is Profile → History → HistoryDetail; Telegram BackButton pops that same chain in reverse.
- Local UI icons/images start warming **before React render**, but they do **not** block the whole App. Global initial readiness waits only for the required fonts; the visual preload queue continues in background. This keeps first render fast while still warming route-owned icons before most navigation.
- The Mini App viewport is fixed at scale 1: the HTML viewport disables user scaling and the root touch-action allows panning without pinch zoom.
- `App` owns the selected History operation payload while HistoryDetail is active. `HistoryScreen` supplies an explicit `detailState`; App uses that state both to render `HistoryDetailScreen` and to expose the matching Figma node through `AppShell`.
- `App` also owns the transient Checkout payment draft while the provider imitation is active. `CheckoutScreen` confirms provider + live total, App pushes `PaymentSimulationScreen` (`7370:33064`), then `Оплатить (Имитация)` replaces that stack entry with the existing `HistoryDetailScreen` waiting state (`6128:23570`). Checkout-generated waiting state automatically becomes the existing success/`Оплачено` state (`6128:23400`) after **3000 ms**; `HistoryDetailScreen` owns the ensuing 450 ms timer → check/status-content visual morph, while App still owns only the state/timer. Back from that success result resets navigation to Main.

## Global toast ownership

- `App` owns `toasts`, each toast's independent lifetime timer, and `activeToastIds` used by toast-coupled controls such as `CopyIconButton`.
- Every notification receives a unique toast id and `notify(message)` returns that id synchronously to the caller.
- Normal lifetime is **5000 ms per toast**; notifications stack instead of replacing each other.
- While the front toast is actively dragged, its remaining lifetime is paused and is resumed if the gesture cancels/snaps back.
- Automatic removal keeps its id in `activeToastIds` for the **220 ms** visual exit so a copy button does not reset before its toast has actually disappeared.
- Automatic close is the reverse of the 220 ms opening transform. A manual swipe scrubs that same transform; a committed swipe calls `onDismiss` only after the reverse-close motion has visually completed, so its active id is not cleared early.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/App.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `App.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, toast ownership, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.


## Initial readiness / UI skeleton

- Required product fonts are the only global initial readiness dependency. `App` waits for `waitForAppFonts()`; local image/SVG warmup is intentionally background-only and never holds the whole UI.
- While those faces are not ready, the app renders a lightweight Main-shaped skeleton instead of allowing fallback font metrics to flash and then reflow.
- Independent text placeholders use `Skeleton type="font"` and their height equals the **final line-height**. Block/Card surfaces continue to use their own `state="loading"` contract.
- Font readiness is page-session cached and fails open after **1200 ms**. Local visual warmup is separately page-session cached and never controls the global skeleton.
- A font load failure must not trap the UI forever; the readiness promise failure is caught and the app is allowed to render with the browser fallback as an exceptional recovery path.

## Current History detail Figma states

`HistoryDetailScreen` maps explicit operation state to the current nodes:
`success 6128:23400`, `waiting 6128:23570`, `processing 6128:23670`,
`error 6137:30574`, `expired 6409:29297`, `referral 7166:120223`,
with `loading 6532:50286` as the loading fallback.

## Locations root navigation

- `SCREEN.LOCATIONS` is the common Navigator `configurations` / `Локации` destination. Its Figma states are `7435:36711` (Купленные) and `7435:37052` (Доступные).
- `openLocations(nextTab)` accepts an optional `purchased` / `available` target. Main uses this for its two `Все` shortcuts so each section opens the corresponding Locations tab; Navigator calls without a target keep the current inner tab.
- App owns `locationsTab`, so the selected inner tab survives a nested Country visit and Back: Locations/Доступные → Country → Back returns to Locations/Доступные rather than resetting to Купленные.
- Enabled cards push the existing single `SCREEN.COUNTRY`; Locations itself stays a root stack entry.
- App reconciles session device counts when either Main or Locations becomes current, so both purchased-card lists reflect Country-side device deletion immediately.

## Country specifications navigation

- Country `/характеристики` pushes `CountrySpecificationsScreen` (`7172:124235`) onto the same internal screen stack.
- Telegram BackButton returns Specifications → Country; the selected location payload remains owned by App.
- The specifications screen is nested detail UI, never a separate URL.

## Native BackButton stability

- Back visibility is derived from **internal stack depth**, not from the current screen name: depth 1 = host Close/root chrome, depth >1 = Telegram BackButton.
- The Telegram `BackButton.onClick` handler is subscribed once and only removed when App unmounts.
- Visibility is synchronized in `useLayoutEffect` and is **not hidden in effect cleanup**. Therefore Detail → parent (for example depth 3 → 2) leaves Back continuously visible instead of briefly flickering to Close and back.
- `nativeBackVisibleRef` suppresses redundant show/hide calls; Telegram receives a visibility command only when the root/nested class actually changes.

## Country state variations

- App has exactly one `SCREEN.COUNTRY`.
- The selected location's `accessState` selects Country's current Figma/state mapping:
  `available → 6643:24352`, `active → 7261:26032`, `limit → 6447:27934`, `maintenance → 6520:46426`.
- `figmaNode` for AppShell is derived from that state while the internal navigation stack remains unchanged.
- Main purchased cards all call the existing `openCountry(locationId)` path; no parallel routes/screens were introduced.

## Country variation selection

- There is exactly one `SCREEN.COUNTRY`.
- `selectedLocation.accessState` selects the concrete Figma variation used by `CountryScreen` and `AppShell`:
  - `available` → `6643:24352`
  - `active` → `7261:26032`
  - `limit` → `6447:27934`
  - `maintenance` → `6520:46426`
- Opening Germany/Lithuania/Kazakhstan from Main therefore pushes the same Country stack entry; no state-specific route is created.

## Prototype device persistence

- `App` owns the purchased-location device counters used by Main and Country.
- Counts are session-only under `bittvpn:device-counts:v1`; the document bootstrap clears stale session/local snapshots once so a fresh Mini App/document runtime restores fixture devices.
- Returning to Main re-reads the session counters as a safety reconciliation step, so Main cannot remain on a stale count after device deletion/success-sheet transitions.
- Country's concrete remaining device identities are persisted by `PurchasedDevices` for the same session; App only owns the derived count.


## Checkout payment flow

- `CheckoutScreen` remains one App screen; `PaymentMethodSheet` is overlay state inside it, not a stack entry.
- Confirming `Оплатить N ₽` stores the current payment draft and pushes `SCREEN.PAYMENT_SIMULATION` / Figma `7370:33064`.
- The payment imitation uses only the product-owner supplied local WebP.
- `Оплатить (Имитация)` creates a `detailState='waiting'` operation carrying location, amount and payment service, then replaces the simulation stack entry with `SCREEN.HISTORY_DETAIL` / `6128:23570`.
- That checkout-generated waiting state is intentionally visible for **3000 ms**, then App mutates the same operation to `detailState='success'`; `HistoryDetailScreen` switches in place to existing Figma state `6128:23400` / `Оплачено` and handles the 450 ms timer → check/content transition locally, without a duplicate result screen.
- Back while the 3-second waiting state is still active returns to Checkout and cancels the pending success transition. `Продолжить оплату` can also replace waiting with the simulation again while the draft exists.
- Back from the checkout-generated `success` result is a terminal flow action: App clears the transient payment draft/selected operation and resets the internal stack directly to `SCREEN.MAIN`.
