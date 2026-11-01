# HistoryScreen

**Source:** `src/screens/HistoryScreen/HistoryScreen.js`

## Purpose

Full Profile operation-history detail screen. It opens from the `Все` button in the compact history block on Profile.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6295:26387` — `t-profile | history`
- Treat this node as the source of geometry, spacing, color, typography and sample states.

## Verified Figma details

- Product content begins at the same Telegram-safe top boundary as the other screens; do not render the Figma iOS/TMA chrome in product DOM.
- Month navigation uses the existing Figma `Chip` / `SingleSelectChipGroup` primitives. Both chip and group are **HUG/max-content**, chips are 32 px high, 12 px radius, `16/20` typography, 12 px horizontal padding, and 8 px gaps. In the concrete History instance (`6436:32616`) the five chip widths are **62 / 89 / 94 / 87 / 79 px** for `Март / Февраль / Сентябрь / Декабрь / Ноябрь`; together with four 8 px gaps the HUG group is **443 px** wide.
- The HUG chip group sits inside a separate horizontal overflow viewport. The viewport may clip the next chip at the right edge, matching the frame; do not put `overflow-x` or fill-width behavior on `SingleSelectChipGroup` itself.
- The current History sample contains five date groups with **16 px** between groups, in this visual order:
  - `21 марта, воскресенье` — 4 rows: DE processing `139 ₽`, KZ awaiting payment `199 ₽`, BittRussia success `98 ₽`, JP overdue `3 132 ₽`.
  - `20 февраля, четверг` — single referral-bonus row, success `+29 ₽`.
  - `15 декабря, среда` — 2 rows: KZ payment error `199 ₽`, JP success `132 ₽`.
  - `13 ноября, понедельник` — single BittRussia success row `98 ₽`.
  - `24 сентября, среда` — 2 rows: KZ payment error `299 ₽`, JP overdue `132 ₽`.
- Date caption → card gap is **12 px**.
- Multi-row cards use `16 px` top/side padding and `20 px` bottom padding. Every non-terminal row is `56 px`; the terminal row is `40 px`; rows have **12 px** gaps.
- Single-row cards use `16 px` padding around the terminal 40 px row.
- Row separators are **1 px solid `#E9F0F3` at 15%**, starting after the 32 px leading slot + 12 px gap (**44 px left inset**) and ending at the right edge.
- The referral-bonus row uses the current user-supplied `referral.svg`, stored durably as `src/assets/icons/history-referral.svg`.
- Bottom spacing follows the Figma safe-area guidance (this is layout guidance, not a third AppTabBar variant): content reserves `24 px + Telegram/system bottom safe area`; the Home Indicator is system UI and is not drawn by the app.

## Interaction / navigation

- This is a nested/detail screen in `App`'s internal stack, not a new route/page.
- Opening it from Profile pushes `HistoryScreen`; Telegram BackButton pops back to Profile.
- Every operation row is tappable and pushes `HistoryDetailScreen`. The row carries an explicit detail state: `Успешно → success`, `Ожидает оплату → waiting`, `В обработке → processing`, `Ошибка платежа → error`, `Платеж просрочен → expired`; the referral-bonus success row explicitly uses `referral` → `7166:120223`. Telegram BackButton returns Detail → History.
- The month-chip rail is **viewport-fixed** at `16 px + --app-safe-top`; it remains visible while the history scrolls underneath. Behind it is the exact current Figma `wrapper` treatment from node `7122:119761`: **`bg/page` (`#0A0C0F`) at 80% opacity + 6 px backdrop blur + 20 px radius**. The visual wrapper starts at the top of the app viewport and ends **20 px below the 32 px chips**; it is purely visual and must not change the rail's 56 px logical/activation geometry. The rail's 56 px logical height remains exactly **32 px chip height + 24 px Figma content gap**, so the activation line is still the rail's **bottom edge**; do not add another 24 px in JavaScript.
- Month chips are **in-page navigation**, never filters. A month tap leaves every operation visible and navigates to the first date group for that month.
- Chip options are derived from months that actually exist in `HISTORY_GROUPS`, deduplicated in first-appearance order. There is no separate hard-coded month list.

### Scrollspy / activation line

- In normal `SCROLLSPY` mode, the active month is the month of the section heading that has **most recently crossed the activation line from above**. `IntersectionObserver` is used as the asynchronous geometry trigger; no per-frame scroll polling is allowed.
- If the user reaches the **absolute end** of the active vertical scroll container, force the final history month active, even when several final sections are visible simultaneously. A lightweight `scroll` listener is used only for this exact end-boundary check; it does not poll section geometry.
- Merely seeing the last month inside the viewport is **not** sufficient to force it active. Outside absolute-end handling, the same activation-line rule applies to every month.
- Every automatic active-month change may horizontally scroll the chips only enough to reveal the active chip when it is partially or fully clipped. Do not center an already-visible chip.
- Manual horizontal scrolling of the chips never changes the active month.

### Tap / manual-selection lock

1. Tapping a chip immediately makes that chip active.
2. The screen enters `MANUAL_SELECTION`; automatic scrollspy updates are ignored.
3. Programmatic scrolling targets the first date group of that month at the activation line. The requested target position is clamped to `[0, maxScroll]`, so final months do not receive artificial bottom padding merely to make them align.
4. The manual lock **survives programmatic scroll completion**. It is not released by IntersectionObserver geometry.
5. The first genuine user-driven **vertical** scroll gesture (vertical pointer drag or vertical wheel) releases the lock and immediately returns control to scrollspy. A horizontal chip drag must not release it.

This prevents intermediate chip flicker during a smooth jump, e.g. tapping `Ноябрь` must remain `Ноябрь` while the list passes other month sections.

### No-movement tap

- If a chip tap resolves to effectively the current vertical position (already aligned or clamped at `maxScroll`), selection/manual-lock behavior still applies but **there is currently no date-caption highlight or other extra visual feedback**.
- A repeated tap on the already-active chip repeats the positioning attempt and keeps that explicit selection locked until the next real user-driven vertical scroll.

### State model

```text
SCROLLSPY
    ↓ tap month
MANUAL_SELECTION
    ↓ programmatic scroll
MANUAL_SELECTION
    ↓ first user-driven vertical scroll
SCROLLSPY
```

- Respect `prefers-reduced-motion`: programmatic horizontal/vertical movement becomes immediate rather than smooth; selection-lock semantics remain the same.
- In the current Figma sample the derived month set is `Март / Февраль / Декабрь / Ноябрь / Сентябрь`, but the implementation must keep adapting automatically as history data changes.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and `src/App.md` before changing navigation.
3. Re-read Figma node `6295:26387` when changing layout/content.
4. Reuse the existing `Block`, `Chip`, and `SingleSelectChipGroup` components.
5. For scrollspy behavior, preserve the IntersectionObserver + viewport-fixed rail + scroll-margin approach unless a concrete platform issue requires another implementation.

## Documentation update rule

If `HistoryScreen.js` changes in layout, behavior, states, assets, navigation, timing, Figma source or constraints, update this file in the same change.

## Referral glyph

- Referral bonus rows use the exact user-supplied `referral.svg` as the durable local `src/assets/icons/history-referral.svg`.
- The uploaded `referral.svg` is the History-row leading glyph only. The current dedicated referral detail screen `7166:120223` uses the standard success/check `OrderStatus`.
