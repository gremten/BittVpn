# SlotsInfoSheet

**Source:** `src/features/country/SlotsInfoSheet.js`

## Purpose

Informational BottomSheet opened from the included-slots Card on an available/not-yet-purchased country.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Screen state: `7181:25029` — `t-country | not purchased | slots information`.
- Overlay: `7335:28670`.
- BottomSheet instance: `7335:28673`.
- Sheet data: `7335:28672`.

## Verified layout

- Reuses shared `BottomSheet`; this is overlay state inside the existing Country screen, never a new App route.
- Sheet glass, blur, shadow, grabber and all outer spacing come from the shared BottomSheet.
- Uses the canonical BottomSheet bottom clearance (`20px + --app-action-safe-bottom`); this instance has no safe-area override.
- Content gap: **24 px**. Title: Martian Grotesk **16/24**.
- Explanation table: **19.49 px** marker column + **12 px** gap + fluid copy column.
- Reuses the durable local `benefit-dotline.svg` / `benefit-dot.svg` assets already used by the bonus-information sheet; their authored geometry is 10.49×67.039 and 10.49×10.49.
- Rows are 56 / 56 / 40 px with 12 px gaps; the first two have a 1 px `border-primary` 15% separator.
- Row title is Golos UI **16/20**; caption is **12/16** secondary text.

## Copy

1. `Связь с устройством` — `Конфигурация связывает локацию с устройством`.
2. `Один слот на устройство` — `Каждая конфигурация занимает один слот`.
3. `5 слотов включено в подписку` — `Можно докупить ещё 5 дополнительных слотов`.

## Interaction

- Opens when the available-country included-slots Card is clicked/tapped or activated from keyboard.
- Closes through the shared overlay, grabber, downward sheet swipe or Escape.
- While open, Telegram native bottom chrome uses the sheet color through the Country screen's shared sheet-open synchronization.
