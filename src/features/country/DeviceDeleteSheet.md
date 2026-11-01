# DeviceDeleteSheet

**Source:** `src/features/country/DeviceDeleteSheet.js`

## Purpose

Country device deletion confirmation, pending and success BottomSheet.

## Figma

- Single confirmation: `7297:38422`.
- Multi confirmation: `7297:33612`.
- Pending: `7297:38554` over overlay `7297:38553`.
- **Current success screen:** `7318:30920`.
- **Current success BottomSheet:** `7318:30948`.

## Confirmation / pending

- Static exact trash icon in the 90×90 status shell.
- Confirmation has `Удалить` + `Отменить`.
- Pending keeps the same sheet mounted with one disabled `Удаляем...` button.
- Pending is non-dismissible and has a minimum 650 ms visible duration.
- Data → ButtonGroup gap is exactly 32 px.

## Success — current Figma 7318:30948

The current Figma state keeps the ButtonGroup visible.

Geometry at the 402 px / 34 px safe-bottom reference:
- top padding: 44 px;
- data height: 138 px = 90 icon shell + 24 gap + 24 title;
- data → ButtonGroup: 32 px;
- one enabled Button: 56 px;
- bottom product tail + safe area: 54 px;
- total sheet height: **324 px**, matching Figma y=550 → 874.

Content:
- exact 22-dot check remains the final `DotMorphIcon` endpoint;
- one-device copy is exactly `Устройство было удалено`;
- multi-device fallback is `Устройства были удалены`;
- Button label is exactly `Готово`;
- `Готово` is an enabled `large / secondary / circle / elevated / default` Button and closes the success sheet immediately.

The success sheet still auto-closes after 3000 ms or may be dismissed normally. Current Figma instance `I7318:30948;7297:35166;5943:17032` is `size=large, type=secondary, form=circle, color=elevated, state=default`. Tapping `Готово` calls `onClose` immediately.

## Motion

The 450 ms trash→check morph is preserved.

Pending→success now changes only the title/data height by 24 px. The 32 px gap and 56 px action slot stay present, so the sheet moves from 348 → 324 px instead of collapsing the whole action area.

The existing 620 ms + 40 ms delayed `cubic-bezier(.22,1,.36,1)` resize is kept for that small 24 px move.
