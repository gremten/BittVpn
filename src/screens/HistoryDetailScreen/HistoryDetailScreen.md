# HistoryDetailScreen

**Source:** `src/screens/HistoryDetailScreen/HistoryDetailScreen.js`

## Purpose

Nested detail screen for one operation selected from `HistoryScreen`. The visual state is selected from the operation's payment status while the operation-specific location/title and amount come from the clicked history row.

## Figma sources

File: `5ks9FYkDbV4fcg60G4SLjf`, page `🛠️ Userflow и прототипирование`.

| Detail state | Figma node | History status |
| --- | --- | --- |
| `success` | `6128:23400` | `Успешно` |
| `waiting` | `6128:23570` | `Ожидает оплату` |
| `processing` | `6128:23670` | `В обработке` |
| `error` | `6137:30574` | `Ошибка платежа` |
| `expired` | `6409:29297` | `Платеж просрочен` |
| `referral` | `7166:120223` | referral bonus / `Успешно` |
| `loading` | `6532:50286` | waiting-payment loading state |

Treat the concrete state node as the source of geometry, typography, blocks, actions and status illustration.

## Props / data

| Prop | Contract |
| --- | --- |
| `operation` | history row or checkout-generated payload; includes `detailState`, amount and optional `locationName`, `paymentService`, `paymentOrigin` |
| `onContinuePayment` | optional callback used by checkout-generated `waiting` state to reopen payment imitation |

`HISTORY_DETAIL_FIGMA_NODES` is exported so `AppShell` can expose the correct live Figma node for the selected state.

## Verified layout

- Product content begins at `16 px + --app-safe-top` and uses `20 px + side safe-area` horizontal insets. Figma's iOS/TMA status/header controls are host chrome and are not rendered by the app.
- Top-level product sections use **24 px** gaps.
- Status art is the reusable `OrderStatus`: **86×86**, radius **20**, `bg/surface`; default illustrations are the exact **64×64** Figma check/time/cross exports.
- Status-to-title gap is **16 px** for `success` and `referral`, and **20 px** for `waiting`, `processing`, `error`, `expired`, and `loading`.
- Status copy uses 24/32 Martian Grotesk medium title + 14/18 secondary subtitle, centered with an **8 px** title/subtitle gap. This follows current title component `6136:22927` and applies to every History detail state.
- Detail blocks use `Block`, radius 20, 16 px top/side padding and 20 px bottom padding. Rows reuse internal `DetailRow`: 16/20 body, 12 px vertical tail and `border/tertiary` at 15% between rows.
- A detail block paired with the Support button uses a **12 px** gap.
- Fixed primary actions use the existing `AppTabBar type="action"` + large circular `Button`; do not draw a Home Indicator.
- During checkout waiting → success, the shared CTA surface stays mounted only for the 450 ms status morph and exits through `AppTabBar hidden`; screen CSS does not override tabbar geometry.
- No-CTA states reserve the normal dynamic bottom safe area rather than a fixed device inset.
- Loading uses the Figma loading surfaces: 86 px `OrderStatus state="loading"` plus two **144 px** `Block state="loading"` placeholders.

## State behavior

- `success` (`6128:23400`): `Оплачено`; purchase block with receipt link, access block (`Срок доступа / Начало / Окончание`), payment block, Support button.
- `waiting` (`6128:23570`): `Ожидаем оплату`; purchase + payment blocks, fixed `Продолжить оплату` CTA. No Support button in this state. Checkout-generated waiting payloads use their real selected `paymentService`; legacy History rows fall back to `ЮKassa`.
- `processing` (`6128:23670`): `Платёж в обработке`; order summary including extra devices, payment block, Support button.
- `error` (`6137:30574`): `Ошибка платежа`; order + payment blocks, Support button, fixed `Повторить оплату` CTA.
- `expired` (`6409:29297`): `Срок оплаты истёк`; order + reduced payment block (no payment-method row), Support button, fixed `Повторить оплату` CTA.
- `referral` (`7166:120223`): `Бонус начислен`; standard success/check `OrderStatus`, one two-row block (`Сумма`, `Дата начисления`) and Support button. The history-list referral glyph remains separate; the detail status no longer uses the previous custom referral glyph.
- `loading` (`6532:50286`): waiting-payment heading/subtitle remain visible while `OrderStatus` and both 144 px detail blocks use canonical skeleton loading; no CTA.

### Waiting-payment countdown

- `waiting` and `loading` show a **real `09:45 → 00:00` countdown** in the subtitle.
- At `00:00`, the next second restarts the cycle from `09:45`, per the prototype requirement.
- Countdown origin is remembered in a page-session map keyed by the operation payload, so re-renders and a loading→waiting transition for the same operation do not arbitrarily restart it.
- The timer is derived from `Date.now()` rather than decrementing state blindly, so inactive tabs / delayed callbacks do not accumulate drift.

## Navigation

- `HistoryScreen` row tap pushes `HistoryDetailScreen` onto `App`'s internal screen stack.
- Checkout payment imitation also reuses this screen: `Оплатить (Имитация)` replaces the simulation entry with a checkout-generated `waiting` operation (`6128:23570`). Back during this waiting phase returns to Checkout, not to the fake provider page.
- App keeps that checkout-generated waiting state on screen for **3000 ms**, then changes the same operation to `detailState='success'`. The screen still reuses the existing `6128:23400` / `Оплачено` state, but the visual handoff is authored instead of abrupt: `OrderStatus` morphs the 64 px timer dot matrix into the check for **450 ms**, success copy/body ease in, and the old fixed `Продолжить оплату` tabbar fades/slides out through the shared `AppTabBar hidden` motion. No separate payment-result screen is created.
- If the waiting detail is left before 3000 ms (Back or `Продолжить оплату`), App's timer is cleaned up and no hidden success transition fires.
- For that checkout-generated waiting operation only, `Продолжить оплату` calls `onContinuePayment` and pushes the payment-imitation screen again. Legacy History waiting rows keep the same visual CTA but have no checkout callback.
- Back from a checkout-generated `success` operation is terminal for the purchase flow: App resets directly to Main and clears the transient Checkout payment payload. Ordinary History `success` rows keep normal Detail → History → Profile back behavior.
- Telegram BackButton always follows the same App stack. The screen is not a URL route.
- History status → detail state is explicit data (`detailState`) on each sample row; do not infer state from text color.

## Before changing this

1. Read `/AGENTS.md`, `src/App.md`, `HistoryScreen.md`, and this file.
2. Re-read the exact Figma state node before changing a state.
3. Reuse `OrderStatus`, `Block`, `DetailRow`, `Button`, and `AppTabBar`; do not create local clones.
4. Keep host Telegram chrome out of product DOM and preserve dynamic safe areas.

## Documentation update rule

Update this file in the same change whenever state mapping, geometry, actions, data shape, assets, Figma nodes or navigation behavior change.
## Fixed CTA geometry

When present, the fixed CTA uses canonical `AppTabBar type="action"` geometry and the scroll body keeps its established CTA reserve (`120px + app safe bottom`); HistoryDetail has no tabbar wrapper override.
