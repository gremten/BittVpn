# ProfileScreen

**Source:** `src/screens/ProfileScreen/ProfileScreen.js`

## Purpose

Profile screen DOM state.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `7015:114849` — `t-profile | profile`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `onOpenMain` | `required/controlled by caller` |
| `onOpenLocations` | `required/controlled by caller`; switches to the root Locations destination |
| `onOpenReferral` | `required/controlled by caller` |
| `onOpenHistory` | `required/controlled by caller`; opens full operation history detail |
| `onNotify` | `required/controlled by caller`; returns the created toast id |
| `activeToastIds` | `Set` from `App`; passed to `CopyIconButton` so its check state follows its own toast |

## Verified Figma details

- History block: `7015:115107`, 362×260.
- History content is 330×224 with **20 px** between date groups.
- Inside a date group there is **12 px** between the date caption and its row list.
- First group rows are `56 px` then `40 px`, with **12 px** between rows. The 56 px row includes the 16 px separator tail; the terminal row is exactly 40 px with no separator tail.
- Second date group is 68 px total: 16 px date + 12 px gap + 40 px terminal row.
- Current Profile referral stat captions are **`Приглашено`** and **`Бонусы`** (not the older `Друзей` / `Баланс`).
- History row separators follow the current Figma separator treatment: **1 px solid `#E9F0F3` at 15% opacity**, with a **44 px left inset** (32 px code column + 12 px gap); terminal rows have no separator.
- Current local icon sources are exported from the current Figma components, not hand-drawn approximations:
  - rendered Profile `icn_s_copy` instance → `7015:115067` (master `6101:31046`), 16×16, including the Figma `#A8A8BF` / 50% instance treatment
  - `icn_s_chevron_right` → `6091:29795`, 16×16
  - `icn_m_friends` → `6419:32236`, 24×24
  - `icn_m_bonus` → `6419:32088`, 24×24

## Styling

- `src/screens/ProfileScreen/ProfileScreen.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- This is a screen component rendered by App state, not a separate URL/page.
- Referral title/chevron and both referral stats open the same Referral screen.
- Share/Copy actions must not navigate.
- The `Все` button in `/история операций` pushes the full History screen (`6295:26387`). From there, tapping an operation pushes its status-specific `HistoryDetailScreen`; Telegram BackButton returns through Detail → History → Profile.
- Profile avatar may use Telegram `initDataUnsafe.user.photo_url`; this is approved runtime/user data, not a Figma asset. It is warmed in the background at app startup, with the existing local profile icon kept as fallback.
- Navigator Home/Locations/Profile transitions are primary-root navigation. Entering any of these roots must not show Telegram BackButton; Home and Locations switch directly to their root states.
- Planned next iteration: dedicated Profile states and related profile behavior/assets will be designed next. Preserve the current Telegram-avatar + local-fallback behavior until those states are explicitly specified.

- Profile headline uses the Telegram **name**, not `@username`. Emoji/pictographic characters are stripped from the displayed name where possible before render.
- Profile headline visually clamps to a **236 px** max width and ellipsizes when the name is longer.

- Copy buttons keep their check state and disabled state until the exact toast created by that button has fully disappeared from the global toast stack.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/screens/ProfileScreen/ProfileScreen.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ProfileScreen.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.


## History interaction

- The compact `История операций` preview in Profile uses the same operation-detail navigation as the full History screen.
- Each visible operation row is a semantic button and opens its matching detail state:
  - `Ожидает оплату` → `waiting`
  - `Платеж просрочен` → `expired`
  - `Успешно` → `success`
- Do **not** add card/cell scale-on-hold animation here. The existing History block/cell visual structure stays unchanged; only the operation row becomes interactive.
- The `Все` button continues to open the full History list.

## Profile ID copy interaction

- The ID copy control is visually text/icon-only. It has **no filled pressed state**.
- Native/WebKit button appearance and tap highlight are explicitly disabled; `:active` stays transparent.
- Keep keyboard `:focus-visible` accessibility from the global focus style.

## Avatar loading

- A remote Telegram avatar uses the shared `Skeleton type="control"` at 106×106 only on the **first unresolved attempt for that photo URL in the page session**. Its loaded / slow-fallback / failed outcome is remembered in module scope, so reopening Profile never intentionally shows the same avatar skeleton again.
- Loaded avatar URLs are remembered for the page session so navigating away/back does not intentionally reintroduce a loading placeholder for an already-loaded photo.
- If there is no Telegram photo URL, or the remote photo fails to load, the existing local fallback icon is used. If a slow remote image later loads after the fallback appeared, it can still replace the fallback and is remembered for the page session.
## Bottom navigation geometry

Profile reaches the Navigator through `NavigatorDock`, which delegates to `AppTabBar type="navigation"`. NavigatorDock has no geometry. Profile keeps its established screen-owned bottom reserve (`56 + 20 + 24 + max(32, safe-bottom)`).
