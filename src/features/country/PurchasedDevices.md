# PurchasedDevices

**Source:** `src/features/country/PurchasedDevices.js`

## Purpose

Shared `/мои устройства` section for purchased Country variations.

## Current Figma

- Normal: `7261:26039`.
- Limit: `6447:27942`.
- Technical works: `6521:47893`.
- Device Card master geometry: 68 px high, 12 px padding, 16 px radius, 44 px platform tile, 8 px tile/text gap, 24 px more glyph.
- Section heading uses 16/20 Martian Grotesk and a 24 px outlined count control.
- Limit-at-capacity state adds the warning count (`6/6` + warning icon), warning Card, and 56 px `Увеличить лимит` CTA before device cards. Its subtitle `+1 устройство за N ₽/мес.` reads N from shared `EXTRA_DEVICE_PRICE` (currently 69 ₽); never hard-code the price literal.
- Expiring-extra-slot below capacity uses Figma `6502:41574`: after deleting from `6/6` to `5/6` while the expiry banner is still open, the CTA disappears, the count becomes primary-white `5/6` + white warning glyph, and the notice becomes regular `bg/surface` with primary-white iconography.
- Device-list spacing is 8 px.

## State model

- `location.deviceUsed` is the original prototype inventory and `location.deviceLimit` is the current slot limit.
- The concrete remaining device ids are persisted per location, so deleting a non-last device does not resurrect/reorder the original list on re-entry.
- `used >= limit` controls only the **`Увеличить лимит`** CTA. Reaching capacity is not itself a warning.
- `limited` marks the separate future-expiry scenario where an already-expanded temporary slot is about to end. It survives a device deletion: `6/6 → 5/6` does not clear the expiry state.
- While `used >= limit`, expiry warning UI uses the warning-colored capacity treatment from `6447:27942`; while `used < limit`, the same future-expiry state switches to the informational treatment from `6502:41574`.
- The warning Card dismissal is persisted per location in `sessionStorage` under `bittvpn:dismissed-limit-notices:v1`, so a closed notice stays hidden for the rest of the current Mini App session and returns on a fresh session.
- Closing the warning Card uses the same motion language as `AppToast`, but deliberately softer: the visual fade/translate/scale runs for **300 ms** (`opacity 1 → 0`, `scale 1 → 0.97`, `y 0 → -12 px`) while the layout collapse runs for **360 ms**. The two phases overlap, so the following content rises continuously instead of snapping when the Card unmounts. `prefers-reduced-motion` resolves the exit immediately.

## Current icon / counter rules

- Platform glyphs use the exact user-supplied dotted SVGs from `dots.zip`, stored durably as `device-apple.svg`, `device-android.svg`, `device-windows.svg`, and `device-linux.svg`.
- The 44 px platform tile keeps the current Figma border/page surface; the dotted art is clipped inside that tile exactly as in the component.
- `/мои устройства` count is the shared xsmall outlined `Button`, not a hand-built dashed pill.
- Normal count uses the regular outlined treatment; at-capacity limit count uses the existing `outlined + warning` Button variant: 15% dotted border and compact warning content at **75% opacity** (`rgba(255,195,0,.75)`), matching `6447:27943`.
- Below-capacity expiry count (`6502:41583`) returns to the regular 20% primary dotted border and primary-white `5/6` + warning glyph; the warning glyph is the same exact dotted asset, recolored to the primary icon tone.
- At capacity, the limit notice uses the 24 px circle-warning-filled glyph at full warning token `#FFC300` on `bg/warning #27210E`, matching `6521:49043`.
- Below capacity, Figma `6521:49029` changes only the notice presentation to `bg/surface #161A20` with primary-white warning/cross glyphs. The copy does **not** change during `6/6 → 5/6`: both states use the same location-level `limitNotice` (`Завтра лимит уменьшится на 1`), so deleting a device never makes the expiry date/text jump.


## Selection / delete mode

Figma flow:
- delete mode: `6466:34197`
- single confirmation from context menu: `7297:37163`
- multi confirmation: `7291:28571`
- pending: BottomSheet `7297:38554` over overlay child `7297:38553`
- success: `7318:30920` (BottomSheet `7318:30948`)
- context menu: `6532:50398`

Interaction:
- Holding a device Card for **420 ms** enters selection mode and selects the held card.
- Pointer movement >10 px cancels the long-press timer so vertical scrolling wins.
- Device Cards use the global standard `0.985` pressed scale while held/pressed.
- Selection mode header is `/выбрано N устройство/устройства/устройств`; `Отмена` is xsmall secondary/surface.
- Card trailing control becomes the existing 24×24 `CheckboxLabel`.
- Tapping a Card in selection mode toggles it.
- The bottom action becomes a 128 px delete AppTabBar with a 56 px danger button `Удалить N ...`.
- Cancel exits selection mode and restores the ordinary renewal tabbar.

## Device removal motion

- A deleted device Card does **not** disappear abruptly when the delete request resolves. Its list item exits with the same visual grammar as `AppToast`: `opacity 1 → 0`, `scale 1 → 0.96`, and `y 0 → -16 px` over **320 ms** with the softer product easing `[0.22, 1, 0.36, 1]`.
- The device list uses `AnimatePresence mode="popLayout"` plus Motion layout animation. The removed Card can fade/scale upward while the surviving Cards move into their new positions during the same 320 ms window; there is no end-of-animation height snap.
- Multi-delete applies the exit to every removed Card together and lets the remaining list reflow as one continuous motion.
- `prefers-reduced-motion` disables both the exit and list reflow animation.

## Context menu

- `…` opens the exact current `ContextMenu` 8 px below the Card. The overlay eases from 0 → **40% black + 16 px backdrop blur** over 240 ms instead of snapping instantly (`6532:50421`).
- The active Card stays above the overlay.
- Items: `Скачать`, `Инструкция`, `Удалить`, separator, `Выделить`.
- `Удалить` opens a one-device confirmation **without entering selection mode**.
- `Выделить` enters selection mode with that device selected.
- Outside tap, resize or Escape closes the context menu. **Scroll is not a close trigger anymore**: Telegram/WebView may emit an incidental scroll event as a hold gesture starts, which used to kill the overlay before scrub mode engaged.
- While the context menu/single-delete flow owns the bottom area, the renewal CTA is replaced by the normal safe-area-only AppTabBar.

## Delete lifecycle

1. Confirmation BottomSheet.
2. Confirm changes the same flow to pending `7297:38554`; pending remains visible for at least 650 ms.
3. On success, remove the affected local devices and set delete phase to `success`.
4. Success BottomSheet `7318:30948` appears.
5. `DotMorphIcon` runs 450 ms. Intermediate trash rows/columns morph as before, but the final frame resolves onto the exact 22-dot `icn_el_check.svg`.
6. Success copy is `Устройство было удалено` (plural fallback for multi-delete) and the 56 px `Готово` action remains visible as `secondary / elevated / default`; tapping it closes success immediately.
7. Success closes after 3000 ms or normal BottomSheet dismissal.
8. Selection mode and selected ids clear when success closes.

No delete-success toast is emitted in the current flow.

`onDeleteDevices(ids)` remains the optional async backend hook.


## Context menu hold-scrub

Action rows now mirror the Navigator hold/scrub interaction, rotated vertically:

- pointer-down immediately shows the shared `Button type=menu` active fill under the finger;
- hold for **120 ms** enters scrub mode;
- a vertical move of **6 px** may enter scrub immediately, matching Navigator's drag-first shortcut;
- while held, dragging vertically transfers the active/pressed fill to the row currently under the finger;
- crossing to another row triggers optional Telegram `selectionChanged` haptic;
- release executes the row currently under the finger;
- horizontal movement ≥14 px cancels scrub intent;
- the hit area tolerates 36 px horizontal slop around the menu;
- **no icons** are rendered in this action menu;
- **no scale/shrink pressed effect** is used here: the only feedback is the active background moving between rows.

Ordinary pointer taps are committed directly on `pointerup`; the following synthetic browser click is suppressed so the action cannot fire twice. This keeps mouse/touch taps reliable while pointer capture is active in Telegram WebView. Keyboard activation remains supported through the native click path.

### Context menu active row

During hold/scrub, exactly one action row is visually active. As the finger crosses into another row, the old row returns to transparent and the new row gets `#242A33`. This is the same focus transfer concept as Navigator, without icons or scale.

## Device persistence / re-entry
- Remaining device identity is derived from the original `DEVICE_TEMPLATES` list minus a deleted-id set stored in `sessionStorage` under `bittvpn:deleted-device-ids:v1`.
- The derived count is stored in the same session under `bittvpn:device-counts:v1` and reported through `onDeviceCountChange`, keeping Main's `N/limit` counter synchronized.
- Previous `localStorage` prototype values are removed/read no longer. Navigation inside one open Mini App session preserves deletes, while a fresh app session restores the original fixture inventory.
- Migration from the older count-only session state infers hidden trailing devices once, then exact ids remain stable for subsequent deletes in that session.
