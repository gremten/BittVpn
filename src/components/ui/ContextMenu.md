# ContextMenu

**Source:** `src/components/ui/ContextMenu.js`

## Purpose

Reusable context-menu surface.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6464:31187` — `context menu`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `items` | `[]` |
| `className` | `required/controlled by caller` |
| `onSelect` | `required/controlled by caller` |
| `ariaLabel` | `'Контекстное меню'` |
| `style` | optional positioning styles forwarded to the menu surface |
| `item.separatorBefore` | inserts the current 1 px tertiary/15 separator before that item |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/ContextMenu.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ContextMenu.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Current Country concrete instance

- Country context menu: `6532:50398`, concrete menu `6532:50422`.
- Surface: 200×217, `bg/surface #161A20`, 12 px padding, radius 32.
- Menu actions are 44 px high, 12 px padding, radius 999, body/m 16/20.
- `Удалить` uses danger text at 75%.
- Separator before `Выделить`: 1 px, border-primary 15%, with 8 px vertical margins.
- ContextMenu is an explicit no-scale pressed surface; its feedback is active fill only.

## Country overlay behavior

`PurchasedDevices` owns the concrete overlay/placement around this component:
- overlay = black 40% + **16 px backdrop blur** from `6532:50421`;
- active Card is lifted above the overlay;
- if the menu would overflow the visual viewport, Card and menu receive the same animated upward translation.

Pressed variants now reuse the shared Button component state; there is no context-menu-only pressed implementation.

## Button-state reuse

Menu rows are shared `Button` instances, not a separate button implementation. They use the design-system `menu` type and existing `active` state (`#242A33`), but ContextMenu explicitly suppresses scale. This keeps the state token shared while matching the requested action-sheet interaction.

## Hold + drag selection

The Country action sheet uses Navigator-style scrub selection without Navigator's icons or compacting:

- 120 ms hold delay;
- 6 px vertical scrub threshold;
- 14 px horizontal cancel threshold;
- 36 px horizontal slop while scrubbing;
- the existing `Button type=menu state=active` fill (`#242A33`) follows the row under the pointer;
- releasing selects the currently highlighted row;
- Telegram selection haptic fires only when the highlighted row changes;
- rows never scale on press in ContextMenu.

The menu owns pointer capture so the active state can transfer between sibling rows under one continuous hold.

A normal mouse/touch tap is committed directly on `pointerup` rather than depending on the browser/WebView synthetic `click` being retargeted through pointer capture. The synthetic click is guarded to avoid a duplicate selection; keyboard/assistive activation continues through the native click handler.

## Gesture ownership

The menu surface uses `touch-action:none` and suppresses native long-press context menus. This is required for continuous hold/scrub in Telegram WebViews. Parent code must not close the menu on window `scroll`, because some WebViews emit a scroll event at gesture start even when the content does not visibly move.

## Active scrub visual

The row currently under the finger must visibly use the pressed/active fill `#242A33`.

React already moves `Button state=active` between rows during hold/scrub. The ContextMenu-specific transparent base selector is declared later than the shared Button active selector, so a later, more-specific ContextMenu active selector is required:

`.bitt-context-menu__item.bitt-button.bitt-button--active`

The focused row also exposes `data-scrub-active=true`. No scale is used.
