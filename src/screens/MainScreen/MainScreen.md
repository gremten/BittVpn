# MainScreen

**Source:** `src/screens/MainScreen/MainScreen.js`

## Purpose

Main/home screen DOM state.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6429:29217` — `t-main`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `onOpenCountry` | `required/controlled by caller` |
| `onOpenLocations` | `required/controlled by caller`; switches to the root Locations destination and may receive `purchased` / `available` to open the matching inner tab |
| `onOpenProfile` | `required/controlled by caller` |
| `onOpenReferral` | `required/controlled by caller` |
| `onNotify` | `required/controlled by caller`; returns the created toast id |
| `activeToastIds` | `Set` from `App`; passed to `CopyIconButton` so its check state follows its own toast |

## Styling

- `src/screens/MainScreen/MainScreen.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Current Main data / country routing

- Current Main reference remains `6429:29217`; the location data component reference is `5335:15751`.
- `/мои локации` is now real navigation into the existing Country screen:
  - Германия → active/no-limit Country variation `7261:26032`
  - Литва / `Техработы` → maintenance Country variation `6520:46426`
  - Казахстан / limited `6/6` → limit Country variation `6447:27934`
- These destinations are **variations of `CountryScreen` selected by location access state**, not new App screens/routes.
- Current available cards from Figma: BittRussia `114 ₽`, `923 мс`; Japan `367 ₽`, `33 мс`; Spain remains disabled. `/доступные локации` has the compact `Все` control.
- The two Main `Все` controls are navigation shortcuts: `/мои локации → Локации/Купленные`, `/доступные локации → Локации/Доступные`. They must not both fall through to whichever Locations tab happened to be selected last.
- The obvious `DE` code leak on the Lithuania Figma instance is treated as prototype sample data; production keeps the location's actual `LT` code.

## Japan promo routing

- The entire Japan promo banner opens the Japan Country screen.
- The inner `Посмотреть` Button opens the same destination and stops bubbling to avoid a duplicate activation.
- The banner itself has **no pressed/scale state**. Press feedback belongs only to the Button inside it.

## Invariants

- This is the existing Main; do not rebuild an alternative Main beside it.
- Main content uses **20 px horizontal product insets** at the 402 px reference width.
- Referral promo opens Referral; its Share/Copy actions must not navigate.
- The whole clickable `пригласи друга` referral Block has **no pressed/scale state**. Its Share/Copy controls keep their own normal Button/IconButton pressed feedback. The Japan banner surface likewise has no pressed state; only its inner Button shows feedback.
- Navigator Locations action switches to the root `LocationsScreen` through App state; Navigator Profile switches to Profile the same way. Neither root switch creates a Telegram BackButton/history step.

- Copy buttons keep their check state and disabled state until the exact toast created by that button has fully disappeared from the global toast stack.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/screens/MainScreen/MainScreen.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `MainScreen.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Purchased-card routing

The three purchased cards are stateful entries into the **same `CountryScreen` component**, not three new screen entities:

- Германия / normal active access → Country variation `7261:26032`.
- Литва / `Техработы` → Country maintenance variation `6520:46426`.
- Казахстан / warning + reached device limit → Country limit variation `6447:27934`.

Main only selects `location.id`; `App` keeps the route as `SCREEN.COUNTRY` and the selected location's `accessState` chooses the variation.

Current Main data from `6429:29217`:
- Германия: `3/5 устройств`, `10 мс`, `до 30 сентября`.
- Литва: `5/5 устройств`, `Техработы`, `до 1 декабря`.
- Казахстан: warning `6/6 устройств`, `930 мс`, `до 31.01.2028`.
- BittRussia: `114 ₽`, `923 мс`, `Госсервисы`, `Ютуб без рекламы`.
- Япония: `367 ₽`, `33 мс`, `Шоппинг`, `Игры`.

## Main purchased-state visual details

- Purchased-location device usage is derived from App-owned persisted counts, not the static `deviceUsage` strings in `locations.js`; returning from Country must immediately reflect the post-delete `N/limit` value.
- The Kazakhstan limit treatment is active only when its current used count is at or above the configured limit.

- Kazakhstan uses compact warning emphasis `rgba(255,195,0,.75)` on Main **only while the current device usage has actually reached the active limit** (`used >= limit`). The Main card intentionally renders no leading warning icon. If the temporary-slot expiry notice still exists inside Country but a deletion changes `6/6 → 5/6`, Main immediately returns to the ordinary non-warning `5/6 устройств` presentation; the expiry-only `5/6` warning substate is Country-only. The Ping control remains immediately after the count.
- The following `930 мс` is still the Ping control; its status dot is the only separator/status point.
- Lithuania technical works uses one offline Ping dot + `Техработы` in disabled gray. Do not insert a separate `•` before Ping, otherwise two dots appear.


## Sakura revisit behavior

The Japan promo's Sakura is page-session persistent. After its first successful Lottie render, leaving Main and returning must show the already-rendered animation on the first paint. A poster→sharp-animation swap on every Main visit is a regression.
## Bottom navigation geometry

Main reaches the Navigator through `NavigatorDock`, which delegates to `AppTabBar type="navigation"`. The navigation host paints no outer surface. Main keeps its established screen-owned bottom reserve (`56 + 20 + 24 + max(32, safe-bottom)`); AppTabBar edits must not rewrite this page padding.
