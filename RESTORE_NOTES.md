# Restored BittVPN screen flow

This archive is based on the uploaded CRA project, not on the standalone HTML prototype.

## Removed accidental root prototype files

The later standalone files were removed from the project root:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.json`

The real CRA entry remains `public/index.html` + `src/index.js`.

## Added DOM screen states

`src/App.js` now owns a screen stack with:

- Main (`6429:29217`)
- Country (`6643:24352`)
- Checkout (`6606:23733`)
- Profile (`7015:114849`)
- Referral (`6995:114597`)

No React Router / separate URLs were added.

## Flow

- Main navigator → Profile
- Main referral promo → Referral
- Profile referral title/chevron → Referral
- Profile `Друзей` stat → Referral
- Profile `Баланс` stat → Referral
- Share / Copy do not navigate
- Telegram native BackButton pops the internal screen stack

## Referral media layer

`ReferralMatrixRain` is a separate absolute media layer under the referral content.
It keeps the recovered timing contract `600×440`, `300 × 30ms`, `9000ms` loop.
Its clipping height follows the live DOM bottom of `referral-stats` via measurement/ResizeObserver.

## Referral matrix rain — restored local Lottie

`bitmap_matrix_rain` now uses the supplied local Lottie animation, exactly like the Sakura media component uses `lottie-web`.

- original `.lottie`: `src/assets/animations/bitmap_matrix_rain_600x440_compat.lottie`
- runtime JSON extracted from it: `src/assets/animations/bitmap_matrix_rain_600x440_compat.json`
- natural size: `600×440`
- 30 fps, 300 frames, 9 s loop
- no runtime Figma/CDN dependency
- still rendered as a separate media layer and structurally clipped at the live bottom edge of referral `stats`


## Persistent component documentation

The project now contains `/AGENTS.md`, `/DOCS_INDEX.md`, and a same-name Markdown file next to every current React component/screen source. Future implementation work must read those docs before editing and update them in the same change whenever behavior, API, layout, assets, Figma mapping or invariants change.

## Referral/Profile fidelity pass

Latest pass is based on the current Figma nodes, not the earlier approximations:

- referral Lottie presentation opacity was set to 40% at that stage; **superseded on 2026-08-24 by the requested 30%**. Source animation remains local 600×440 / 30 fps / 300 frames / 9 s;
- referral benefit rows corrected to 56 / 56 / 40 px with 12 px gaps and no tail on the final cell; benefit marker geometry was also rebuilt from current Figma dotline/dot primitives;
- Profile history corrected to 20 px between date groups, 12 px after each date and between rows, with 56 px separator rows and 40 px terminal rows;
- Profile/Referral friends and bonus icons, Profile small copy/chevron, global toast success icon, and CopyIconButton default/final icons are local SVG exports verified against current Figma nodes;
- toast auto-dismiss is 5000 ms; upward swipe follows the pointer directly and dismisses after a 36 px release threshold, then exits upward/fades for 160 ms.

## 2026-08-24 — stacked toast motion + copy/toast coupling

- Reworked the global toast from a single replace-in-place message into an independently timed stack.
- Motion at that stage used a below-entry vector; **superseded on 2026-08-24**: the toast enters from above into the same anchor while retaining the smooth fade/scale/spring character. Previous toasts still recede upward/scale behind it.
- Preserved the Figma toast geometry (`7016:116997`, 362×52 at y=118 in the 402px reference frame).
- Every toast keeps its own 5-second lifetime; the lifetime pauses during a controlled swipe and resumes after a cancelled swipe.
- At that stage upward swipe behavior remained 1:1 with the finger, threshold 36px, then continued upward/faded for 160ms. **Superseded by the reversible 18px reveal-path scrub pass below.**
- `notify()` now returns a unique toast id. `CopyIconButton` stores the id produced by its own click, stays in check state and disabled while that toast is present/closing, and returns to copy only after that exact toast disappears.
- Automatic exit keeps the toast id active for the 180ms fade so copy feedback cannot reset early.

## 2026-08-24 — toast entrance direction / viewport scale / rain opacity

- Corrected toast entrance: it now comes **from above** into the existing fixed anchor; stack anchor/geometry did not move.
- At that stage the toast used the smooth fade + scale + spring character from the supplied motion reference and automatic exit eased slightly upward. **Superseded below by the explicit reversible 220ms open/close path.**
- Automatic toast exit presence is 220 ms so copy buttons remain in disabled check state until their own toast has visually finished leaving.
- Locked the Mini App viewport at scale 1 (`minimum-scale=1`, `maximum-scale=1`, `user-scalable=no`) and disabled pinch zoom while preserving x/y panning.
- Set referral `bitmap_matrix_rain` presentation opacity to **30%**.
## 2026-08-24 — toast backdrop blur / shadow

- Restored the toast's 6 px background backdrop blur after the Motion stack transform change by moving the glass surface (background, border and backdrop filter) onto the animated Motion layer itself. This keeps the real page as the sampled backdrop and makes the blur follow the 1:1 swipe.
- Removed the toast box shadow completely; that blur/shadow pass itself did not change geometry, stacking, 5-second lifetime, copy/check coupling or gesture behavior. **The later reversible-close pass below intentionally replaces the old 36px gesture threshold.**


## 2026-08-24 — reversible toast close / scrubbed manual dismissal

- Replaced the separate upward-dismiss animation with one reversible toast reveal path. Hidden/opening pose is 18 px above the anchor at scale 0.96 / opacity 0; visible pose is the existing anchor at scale 1 / opacity 1.
- Opening remains 220 ms and closing now uses the exact same transforms in reverse with the reversed cubic timing curve.
- Manual upward dismissal now scrubs those same transforms from the live pointer position: y follows the finger 1:1 while scale/opacity are computed from close progress.
- The commit threshold is 50% of the reveal path (9 px). Below it the toast plays only the remaining opening fraction back to rest; above it the toast completes only the unscrubbed reverse-close fraction before removal. Manual continuation duration is proportional to remaining path progress, instead of restarting a full 220 ms animation from the release point.
- The 5-second lifetime stays paused through a cancelled drag until the return-to-rest animation has completed.
- Supersedes the earlier 36 px / 160 ms dedicated swipe-dismiss behavior noted above.

## 2026-08-24 — bitmap rain opacity source fix

- `bitmap_matrix_rain` is now actually 30% inside both local animation sources: `bitmap_matrix_rain_600x440_compat.json` and `.lottie`.
- Implemented as one neutral global parent layer (`bitmap_matrix_rain_global_opacity_30`, opacity 30) parenting all 310 original image layers, so each layer’s existing animated opacity remains intact and the whole animation is attenuated exactly once.
- Removed the previous CSS-level 30% attenuation; `.referral-rain-lottie` is now opacity 1 to prevent 30% × 30% = 9%.

## 2026-08-24 — toast reveal through Telegram chrome / primary-nav chrome

- Kept the toast's visible anchor unchanged, but extended the reversible hidden pose from `-18 px` to `-40 px`.
- The visible anchor is 20 px below `--app-safe-top`; the extra hidden travel starts under Telegram's reserved native Close/Back control row. Opacity therefore begins changing before the toast clears the native row, avoiding the previous "appears from nowhere" edge.
- Automatic exit remains the exact reverse of entry and now fades while returning through the same reserved area instead of becoming invisible too early.
- Manual upward dismissal still scrubs the exact same reveal path 1:1 by pointer position. Full closed-path distance is now 40 px and the 50% commit threshold is 20 px.
- Main and Profile are now primary Navigator root states. Main ↔ Profile replaces the root screen instead of pushing the internal back stack.
- Telegram BackButton stays hidden on both Main and Profile, so primary navigation does not turn the host Close control into a Back/app-name control. Nested/detail screens (Country, Checkout, Referral) still use the native BackButton and pop the internal stack.

## 2026-08-24 — matrix rain fidelity fix

- The referral `bitmap_matrix_rain` source is bitmap-based (embedded PNG frames). Rendering it through Lottie SVG caused visible fidelity issues on device: overly bright output, partial rows, floating gradients, and dots that looked incompletely filled.
- Switched `ReferralMatrixRain` to Lottie **canvas** renderer with `lottie.setQuality('high')`, `clearCanvas: true`, and subframe playback enabled.
- Moved the 30% dimming from inside the animation asset to the composed host layer: `.referral-rain-lottie { opacity: .3; }`.
- Reset the helper root layer inside both `bitmap_matrix_rain_600x440_compat.json` and `bitmap_matrix_rain_600x440_compat.lottie` to neutral opacity `100` and renamed it `bitmap_matrix_rain_root`.
- Structural clip, 600×440 geometry, 30 fps, 300 frames, 9-second loop remain unchanged.

## 2026-08-24 — matrix rain switched from Lottie to lightweight MP4

- User supplied the approved source animation as `bitmap_matrix_rain_600x440_wave_slow.gif` inside `bitmap_matrix_rain_600x440_wave_slow.zip` (600×440, 300 frames, 30 fps, 9 s, ~2.9 MB).
- Replaced runtime Lottie/canvas reconstruction with a direct local MP4 transcode of that source: `src/assets/animations/bitmap_matrix_rain_600x440_wave_slow.mp4`.
- Chosen runtime encode: H.264 MP4, 600×440, 30 fps, 9 s, CRF 33, faststart, ~51 KB. This keeps weight tiny while preserving the original fully rasterized dots/rows much better than Lottie reconstruction.
- `ReferralMatrixRain` now renders a looping muted `<video>` (`autoplay`, `loop`, `playsInline`, `preload=auto`) and still respects `prefers-reduced-motion` by pausing on frame 0.
- Structural clip and final 30% opacity remain unchanged.

## 2026-08-24 — rain dimmed to 20% / remote profile photos disabled

- Reduced final referral rain composed-layer opacity from 30% to **20%**: `.referral-rain-video { opacity: .2; }`. Geometry, timing and clip behavior stay unchanged.
- **Superseded later the same day:** this temporary rule also blocked Telegram `initDataUnsafe.user.photo_url`; the current policy below restores Telegram user photos and only forbids temporary Figma/MCP runtime assets.
- **Superseded later the same day:** the temporary local-only profile avatar was reverted once it was clarified that the existing photo came from Telegram, not Figma.

## 2026-08-24 — Telegram avatar restored / proactive local asset warmup

- Corrected runtime asset policy: only temporary Figma/MCP URLs are forbidden. Product-owned UI assets must be local, but Telegram `initDataUnsafe.user.photo_url` is approved runtime/user data and is allowed.
- Restored Telegram profile photo rendering in `ProfileScreen`, retaining the local profile icon as fallback.
- Added `src/utils/preloadAssets.js`: immediately after React mount it asynchronously warms all lightweight local icons/images (`src/assets/icons`, `src/assets/images`) so first navigation does not visibly reveal uncached downloads.
- The Telegram profile photo is also warmed in the background at low priority when available.
- Warmup is intentionally automatic and starts without any user action; it does not preload heavy rain video/Lottie media.

## 2026-08-24 — toast success icon must never disappear during motion

- Fixed a Telegram WebView/runtime artifact where the toast success icon could be absent for part of the enter/exit animation while the toast background/text were already visible.
- `AppToast` no longer renders the success SVG through an `<img>` URL. It imports `icn_m_circle-success-filled.svg` as an inline CRA/SVGR React component, so there is no interaction-time image request/decode/paint dependency.
- The icon remains a child of the same Motion layer as the label and therefore follows the exact same enter/exit/stack/manual-scrub transform and opacity progress.

## 2026-08-25 — Profile/Referral resync + inline Navigator/Toast glyphs

- Re-read current Figma screens `7015:114849` (`t-profile | profile`) and `6995:114597` (`t-profile | referral`) and synced the changed copy/state details.
- Profile referral stat captions are now `Приглашено` and `Бонусы`.
- Referral balance caption is now `Для покупок в BittVPN`; the second benefit caption is `Бонусы начисляются автоматически`.
- Profile history and Referral benefit separators use the current **1 px solid `border/primary` at 15%** treatment (empty Figma dashPattern), while preserving the already-verified row heights and date-group gaps.
- Navigator `5951:24662` was re-read from Figma. Its local SVG glyphs are now rendered as CRA/SVGR inline React components instead of `<img>`, so uncached icon resource decoding cannot appear during nav animation. The active configuration label is `Локации`; existing exact variant widths and scrub behavior remain unchanged.
- Active Navigator source SVGs were also aligned to the current Figma `#0A0C0F` on-color fill, the old CSS `brightness(0)` recolor was removed, and the inactive Profile glyph was replaced with the current Figma variant.
- Toast `7016:116997` was re-verified; its success glyph remains an inline React SVG and stays in the same Motion layer as the label/container.
- Inline Navigator/Toast SVGs are excluded from the generic detached-`Image` warmup to avoid redundant asset requests; static non-inline visuals and the Telegram avatar continue to preload asynchronously.
- No temporary Figma/MCP URL is used at runtime. Telegram profile `photo_url` remains approved runtime user data.


## 2026-08-25 — Profile name source + history separator inset

- Profile header no longer prefers `@username`. It now displays the Telegram user's **name** (`first_name + last_name`) as the primary label.
- Emoji/pictographic characters are stripped from that displayed name where possible so decorative emoji in Telegram names do not consume the limited title width.
- If the cleaned name is unavailable, the implementation falls back to a cleaned username **without** the `@` prefix, then to the existing local placeholder.
- The profile name label is now visually capped at **236 px** and uses single-line ellipsis when longer.
- Rechecked the Profile history separator behavior against the design geometry: the separator is **not full-width**. It begins after the 32 px country code column plus the 12 px row gap, i.e. a **44 px left inset**, and runs to the right edge of the row content area.
- Implementation changed from a full-row `border-bottom` to an inset pseudo-element separator so row heights stay the same (`56 px` / `40 px`) while matching the Figma inset.

## 2026-08-25 — Full Profile operation history screen

- Added nested Profile history detail screen from Figma `6295:26387` (`t-profile | history`).
- Profile `/история операций` → `Все` now pushes the new History screen through App's existing internal screen stack. Telegram BackButton therefore returns to Profile; no fake TMA/iOS chrome is rendered by product DOM.
- Added the current sample month strip (`Март`, `Февраль`, `Сентябрь`, `Декабрь`, `Ноябрь`) using existing `SingleSelectChipGroup` / `Chip` components with horizontal overflow.
- Synced `Chip` `size=small` to current Figma `6436:32497`: 32 px high, `6px 12px` padding, 12 px radius, 16/20 typography, white active state and 60% loading surface.
- Added full history groups and payment states shown in Figma, including the referral bonus entry. The referral leading glyph is committed locally as the exact Figma SVG export from `6432:30398`; no runtime Figma/MCP URL is used.
- Full-history row separators use the same verified inset geometry as Profile: 1 px `#E9F0F3` at 15%, starting 44 px from the card content left edge.
- Screen bottom spacing follows the Figma safe-area component guidance: `24px + var(--app-safe-bottom)`; Home Indicator remains system UI.


## 2026-08-25 — Chip HUG sizing corrected from Figma components

- Re-read Figma `Chip` (`6436:32497`), its master (`6436:32491`), and `SingleSelectChipGroup` (`6436:32518`) instead of approximating the month controls from the History screenshot.
- Confirmed all default/active chips are Auto Layout **HUG/HUG**. Removed the incorrect global `min-width:57px`; default/active chip width is now intrinsic text width + `12px` left/right padding. The empty loading state alone remains fixed at `57px`.
- Confirmed `SingleSelectChipGroup` is also HUG/max-content with an `8px` gap; it no longer stretches to `width:100%` or owns horizontal overflow.
- Confirmed the actual History month instance widths: `Март 62px`, `Февраль 89px`, `Сентябрь 94px`, `Декабрь 87px`, `Ноябрь 79px`, total HUG group width `443px` including four `8px` gaps.
- History now places that HUG group inside a dedicated horizontal scroll viewport, preserving the clipped-next-chip behavior without breaking component sizing.

## 2026-08-25 — updated History content + sticky month scrollspy

- Re-read current Figma History node `6295:26387` after the user expanded the sample content. The history wrapper is now 362×916 and contains March (4 rows), February (1 referral row), two September groups (2 rows each), and November (1 row), with the exact current copy/prices/statuses.
- Month chips remain the existing HUG `Chip` / `SingleSelectChipGroup`; the chip row is now sticky at the Telegram-safe top while history content scrolls underneath.
- Implemented month navigation as scrollspy: clicking a month scrolls to the first group for that month; scrolling updates the active month using `IntersectionObserver` section-top sentinels rather than a continuous scroll handler.
- Added section `scroll-margin-top` so programmatic jumps preserve the 24 px gap below the sticky 32 px chip row.
- The final month can activate when its heading enters the viewport, with an end sentinel as a fallback, so it is still represented even when it cannot physically reach the top activation line. Active-chip changes also keep the selected chip horizontally visible.
- During a smooth chip-triggered jump, the destination chip is intent-locked so scrollspy does not flash through intermediate month states; user pointer/wheel input releases the lock immediately.
- Smooth scrolling is disabled when `prefers-reduced-motion` is enabled.
- **Superseded by the later History resync below:** at this point the Figma sample still had a `Декабрь` chip without a December group; the corrected design now includes `15 декабря` as a real destination.

## 2026-08-25 — History cards/months resynced after Figma correction

- Re-read `6295:26387` after the History sample data was corrected in Figma.
- Current visual group order is: `21 марта` → `20 февраля` → `15 декабря` → `13 ноября` → `24 сентября`.
- March now uses DE `В обработке / 139 ₽`, KZ `Ожидает оплату / 199 ₽`, BittRussia `Успешно / 98 ₽`, JP `Платеж просрочен / 3 132 ₽`.
- December now exists as a real scroll target: KZ `Ошибка платежа / 199 ₽`, JP `Успешно / 132 ₽`.
- November is the single BittRussia success `98 ₽` group.
- September is now a single `24 сентября` group: KZ `Ошибка платежа / 299 ₽`, JP `Платеж просрочен / 132 ₽`; the old duplicated `15 сентября` group was removed.
- The existing sticky scrollspy/chip-jump behavior is preserved; December is no longer a dead chip because it now has a concrete destination.

## 2026-08-25 — History month rail fixed to viewport + data-derived months

- Replaced the History month rail's CSS `position: sticky` with a viewport-fixed rail. The previous sticky element could bind to a non-scrolling overflow ancestor in Telegram/mobile layouts and scroll away with the content; the new rail stays at `16 px + safe-top` consistently while the page scrolls.
- Added an explicit 32 px flow spacer so taking the rail out of document flow does not change the Figma content geometry. The fixed background extends through the original 24 px chip-to-content gap so history cards pass underneath cleanly.
- Removed the separate hard-coded month option list. Month chips are now derived directly from the months present in `HISTORY_GROUPS`, deduplicated in first-appearance/content order; adding or removing a month's history automatically changes the chip rail and its jump targets.
- Initial active month, first-group jump map, last-month handling, horizontal chip visibility, and IntersectionObserver scrollspy all use the same derived month set.

## 2026-08-25 — transparent fixed history chips

- Removed the `bg/page` fill from the viewport-fixed History month-chip rail.
- Chips remain fixed and keep the same scrollspy/jump behavior, but there is no black slab/background behind or below them; page content can visually pass underneath the rail.

## 2026-08-25 — History month navigation: explicit manual lock + activation-line semantics

- Reworked History month navigation to the agreed in-page navigation contract rather than treating chip selection as transient scroll intent.
- The fixed month rail's bottom edge is now the single activation line. Its 56 px box already equals the 32 px chips plus the 24 px Figma gap, so the previous extra 24 px geometry offset was removed.
- Normal user scrolling selects the month whose section heading most recently crossed the activation line. The last month is forced only at the **absolute end** of the vertical scroll container, not merely when its section becomes visible.
- Chip tap immediately enters persistent `MANUAL_SELECTION`: the tapped month remains active throughout smooth scrolling **and after it finishes**. IntersectionObserver callbacks cannot clear this lock.
- The lock is released only by the first user-driven vertical gesture (vertical pointer drag / vertical wheel). Horizontal chip scrolling does not release it or alter the active month.
- Programmatic vertical positioning is calculated against the activation line and clamped to the real `maxScroll`; no artificial trailing padding was added for final months.
- When a tap produces no meaningful vertical movement, only the first date caption for the selected month flashes to `text/primary` for **300 ms**. Repeated taps restart that feedback.
- Horizontal chip autoscroll was tightened to reveal only clipped chips; already fully visible chips are left in place.

## 2026-08-25 — History date feedback softened to 500 ms

- Month-chip date feedback duration changed from **300 ms** to **500 ms total**.
- The feedback no longer snaps the date caption to white and back. `history-group__date--feedback` now runs a 500 ms `ease-in-out` color keyframe: normal date color → `text/primary` → normal date color.
- Only the date text color animates; background, typography, geometry and scroll/navigation behavior are unchanged.

## 2026-08-25 — History fixed-chip backdrop from Figma

- Added the current Figma `wrapper` treatment from node `7122:119761` behind the viewport-fixed History month chips.
- The backdrop has **no fill** (`rgba(0,0,0,0)`), uses **6 px backdrop blur**, and has a **20 px radius**. It spans the app width, starts at the app viewport top, and ends 20 px below the chip row, matching the 402×168 Figma wrapper geometry relative to the safe-area chip position.
- The backdrop is a separate visual layer below the chip scroller; it does **not** change the fixed rail's 56 px logical height, activation line, scrollspy, manual-selection lock, or month-jump math.
## 2026-08-25 — History fixed-chip backdrop resynced

- Re-read Figma node `7122:119761` after the wrapper was changed.
- The History month-chip backdrop is no longer fill-transparent: it now uses **`#0A0C0F` at 80% opacity** (`rgba(10,12,15,.8)`) together with the existing **6 px backdrop blur** and **20 px radius**.
- Wrapper geometry is unchanged: it still starts at the app viewport top and ends 20 px below the chip row, and remains a visual-only layer that does not alter the 56 px rail/activation-line geometry or any scrollspy/manual-selection behavior.


## 2026-08-26 — History operation detail states

- Removed the temporary History date-caption color feedback entirely. Month taps still enter manual-selection lock and attempt the same clamped scroll, but a no-movement/repeated tap no longer highlights the date.
- Added nested `HistoryDetailScreen` and wired every History operation row to it. Explicit status mapping: success `6128:23400`, waiting `6128:23570`, processing `6128:23670`, error `6137:30574`, expired `6409:29297`; loading fallback `6532:50286`.
- History rows now carry `detailState` data instead of inferring detail UI from status color/text. App owns the clicked operation payload and the Detail state is pushed onto the same internal screen stack, so Telegram BackButton follows Detail → History → Profile.
- Detail layouts reuse existing `Block`, internal `DetailRow`, `Button`, `AppTabBar`, and `OrderStatus` primitives; Figma iOS/TMA chrome and Home Indicator remain host/system UI and are not rendered.
- `OrderStatus` was resynced to current Figma: 86×86 surface with exact 64×64 local Figma-exported check/time/cross artwork. The large status art stays white; the previous approximate colored dotted circle/spinner was removed. Loading uses the `bg/loading` skeleton tile.
- Added durable local 64×64 PNG exports under `src/assets/icons/order-status/`; no runtime Figma/MCP asset URLs are used.


## 2026-08-26 — Profile history rows open operation details

- Compact operation rows inside Profile → `История операций` are now interactive and open the same `HistoryDetailScreen` used by the full History list.
- Status mapping for the currently visible Profile rows:
  - Germany / `Ожидает оплату` → `waiting`
  - Japan / `Платеж просрочен` → `expired`
  - BittRussia / `Успешно` → `success`
- No pressed-scale/card-scale interaction was added. The block/cell visual hierarchy remains unchanged; rows are simply semantic buttons with reset button styling.


## 2026-08-26 — Referral operation glyph replacement

- Replaced the referral-operation artwork with the exact user-supplied `referral.svg`.
- Full History referral rows continue to use the 32×32 referral glyph.
- Referral bonus details now use the same referral glyph in the 86×86 `OrderStatus` tile instead of the generic payment-success check; it renders at the SVG's authored 32×32 size.
- `OrderStatus` now accepts optional `icon` and `iconSize` overrides so the detail screen can reuse the existing status container without cloning it.


## 2026-08-26 — Canonical Block/Card skeleton loading

- Re-read Figma `Card` `5941:17273` and `Block` `5943:16932`; their loading states are now the project-wide source of truth for asynchronous surfaces.
- Shared skeleton visual: `rgba(38,44,59,.6)` loading surface, 30 px white strip at 20% opacity, 37.5 px blur.
- The blinking strip now loops smoothly and responsively from offscreen-left to offscreen-right; the old hard-coded 430 px travel and 18 px blur were removed.
- `Card state="loading"` and `Block state="loading"` suppress final children and expose `aria-busy`; loading Cards also suppress click/keyboard interaction.
- `OrderStatus` loading uses the same left→right blinking cycle.
- Removed the HistoryDetail screen-level blur override: skeleton appearance is owned by the design-system component, while the screen only sets its required 144 px skeleton height.
- New invariant: any async surface that resolves into a Card or Block must render that component's loading state instead of a local spinner, empty surface or bespoke skeleton.


## 2026-08-26 — font skeleton gate + session rain cache + Profile ID pressed fix

- Added shared `Skeleton` for independent text/control loading. Font skeleton height is exactly the final line-height; control skeleton mirrors final dimensions/radius and both reuse canonical BittVPN blinking.
- App now keeps real UI hidden behind a Main-shaped skeleton until Golos UI, Martian Grotesk and Nothing Font are ready, preventing fallback-font flash/reflow.
- Referral matrix rain now uses one session-persistent prebuffered `HTMLVideoElement`; navigation pauses/detaches rather than destroying/reloading it.
- Background warmup starts the tiny (~52 KB) rain MP4 before React render; lightweight images remain asynchronous.
- Profile ID copy button no longer shows the native/WebKit gray pressed fill/tap highlight.


## 2026-08-27 — History detail states resynced + real payment timer

- Re-read all current History detail Figma nodes: success `6128:23400`, waiting `6128:23570`, processing `6128:23670`, loading `6532:50286`, error `6137:30574`, referral `7166:120223`, expired `6409:29297`.
- Added the dedicated `referral` detail state. The History referral row now opens `7166:120223`; that detail uses the standard success/check `OrderStatus`, superseding the previous custom-referral-glyph detail treatment. The custom referral SVG remains the History-list row icon.
- Corrected success access rows to `Срок доступа / Начало / Окончание`.
- Resynced status spacing: 16 px for success/referral, 20 px for other states; Block→Support spacing is now 12 px.
- `waiting` and `loading` now render a real `09:45 → 00:00` countdown. After 00:00 the next second starts again at 09:45. The countdown uses a session-stable operation key and wall-clock calculations to avoid callback drift and arbitrary reset on re-render.

## 2026-08-27 — Country specifications + purchase overlay/components resync

- Added nested `CountrySpecificationsScreen` from current Figma `7172:124235`; both compact `Все` and the Country characteristics Block open it, and Telegram Back returns to Country.
- Resynced Country purchase-overlay references `7166:122710` and `7171:123296`: Country content uses 20 px side insets, IdealChoice radius is 20 px, and purchase sheet now owns a 40% black overlay behind the glass surface.
- Resynced shared BottomSheet to current `7166:122124`: 44 px top padding, 11.2 px blur, 36 px top radii, square bottom corners, 32 px minimum bottom padding, existing drag/scroll-lock behavior preserved.
- Resynced DurationSlider to component `7166:121702` and purchase data composition `7166:122079`: natural-flow 32 px HUG badge, 12 px badge/track gap, 44 px track, six measured anchors, existing track + badge drag behavior preserved.
- Discount CTA no longer passes a struck/original price; it renders final label + discount pill.
- Shared extra-device price updated to 99 ₽ and all checkout/characteristics copy now reads `EXTRA_DEVICE_PRICE` rather than a stale literal.


## 2026-08-27 — Referral empty typography + detail-title gap + CountrySpecifications table fix

- Re-read Referral empty `7074:118527`: only this empty state uses `Пригласи друга` at Martian Grotesk 24/32. The populated Referral balance stays 32/40. `ReferralScreen` now exposes `state="empty"` for that exact Figma state.
- Re-read title component `6136:22927`: HistoryDetail title/subtitle spacing is now 8 px across every payment/referral detail state.
- Rebuilt CountrySpecifications `7172:124235` table composition after the runtime screenshot exposed compressed tables. Each Block now contains a rows wrapper with the authored 12 px inter-row gap; exact table heights are 272 / 184 / 228 px.
- CountrySpecifications keeps exact 20 px side insets on narrow screens and uses 24 px + system bottom safe area, with no fake Home Indicator.


## 2026-08-27 — Country device-slots Card resync

- Re-read Figma `7176:124489`.
- `SlotsNotice` now uses the shared `Card` family instead of `Block`.
- Preserved exact current geometry: 16 px padding, 16 px radius, 12 px icon/content gap, 24 px leading icon, 14/18 title and 12/16 secondary caption.
- Replaced the old slots glyph with the exact user-supplied `icn_m_devices.svg`, stored durably at `src/assets/icons/icn_m_devices.svg`.


## 2026-08-27 — Device-slots icon WebView rendering fix

- The new `icn_m_devices.svg` bytes were correct, but Telegram/WebView displayed the `<img>` resource as a broken-image placeholder.
- `SlotsNotice` now imports the same exact local SVG through CRA/SVGR (`ReactComponent`) and renders it inline at 24×24.
- No visual geometry or icon artwork changed; this is only a rendering-path fix.

## 2026-09-02 — Checkout bonus-balance info sheet + characteristics padding

- Re-read current Figma `7223:25096`. `BonusCard` heading is now `бонусный баланс`; its 16 px info glyph is primary white and is a transparent interactive button.
- Added `BonusBalanceSheet` using the shared `BottomSheet`, exact sheet instance `7223:25222` / data `7239:25567`, with the three 56/56/40 dotline rows from Figma.
- Checkout owns the sheet open state and syncs Telegram chrome while it is open.
- Corrected shared BottomSheet bottom clearance to `32 px + system safe bottom` so removing the fake Figma Home Indicator does not also remove its safe-area space.
- Country `/характеристики` compact Block now has 16 px top/side padding and 20 px bottom padding.


## 2026-09-02 — Purchase sheet CTA baseline restored

- Fixed the regression where `Оформить за …` moved upward relative to the closed `Купить доступ` tabbar CTA.
- Cause: the shared BottomSheet had been globally changed from `max(32px, system safe area)` to additive `32px + system safe area` for the bonus-info sheet, unintentionally affecting PurchaseDurationSheet.
- BottomSheet now supports `bottomSafeArea`: default `max` for action sheets, optional `stacked` for concrete info-sheet instances.
- PurchaseDurationSheet uses the default `max` mode again; BonusBalanceSheet `7223:25222` explicitly uses `stacked`, preserving its 66 px reference bottom clearance without shifting purchase CTA geometry.


## 2026-09-02 — full used-component audit + routing/cache stabilization

Three-pass audit against the current Figma library and live prototype instances:

- Button defaults resynced to Figma: xsmall / primary / circle / accent / default.
- IconButton defaults resynced to xsmall / primary / none-glass / accent / circle.
- Badge resynced: default surface; small padding 7×12; medium 10×16; inverse support; optional leading/trailing icons.
- LocationCard pressed now matches the actual Figma pressed variant at 90% scale (320×100 → 288×90.6).
- Chip loading no longer uses a spinner; it uses the canonical 30 px / white 20% / blur 37.5 px skeleton blinking.
- Shared AppTabBar navigation/button-only baseline uses max(32 px, real safe area); navigation keeps the product-approved translucent `rgba(10,12,15,.72)` background plus blur. Safearea is 24 px + **system** safe area.
- SegmentedControl current checkout geometry is 16 px outer radius and 12 px slot/pill radius.
- DataSlider resynced to 7×12 badge padding and a 46 px outer track with 44 px point cells.
- Main Japan promo is clickable across the whole banner and routes to Japan; only its inner Button has press feedback.
- Local visual assets now begin warming before React and are part of initial App readiness, eliminating first-route icon pop-in.
- Telegram BackButton click subscription is stable and visibility is driven only by stack depth. Cleanup no longer hides Back between nested screens, eliminating the transient Back ↔ Close flicker.


## 2026-09-02 — preserve LocationCard pressed + navigation tabbar background

- Product owner explicitly locked two behaviors as ongoing rules:
  - LocationCard pressed is superseded by the global pressed-scale rule and now uses `transform: scale(.985)`.
  - Navigation AppTabBar keeps its translucent `rgba(10,12,15,.72)` background together with the existing 11.2 px backdrop blur.
- Future Figma/component audits must not remove either behavior unless explicitly requested.


## 2026-09-02 — global pressed scale = 0.985

- Product owner superseded the previous LocationCard-specific 0.9 rule.
- Every component that already has scale-based pressed feedback now uses exactly `0.985`: Button, IconButton, Chip, LocationCard, and the clickable Main referral Block.
- Removed the xsmall outlined Button one-off `0.96` and the old generic Button/IconButton/Chip `0.98`.
- Explicit no-pressed surfaces remain no-pressed; notably the Japan banner itself still does not scale, while its inner Button uses the global 0.985 press.
- Navigation AppTabBar background rule remains unchanged: `rgba(10,12,15,.72)` + 11.2 px backdrop blur.


## 2026-09-02 — mobile permanent-skeleton fix without losing route prewarm

- Fixed a regression where mobile Telegram could remain forever on the global skeleton after local-visual readiness was made a hard app gate.
- Root cause: detached `Image` warmup depended on every local SVG/image firing `load` or `error`; some Telegram WebViews can leave a problematic SVG request in neither state. `icn_m_devices.svg` had already demonstrated a broken WebView `<img>` path.
- Inline SVGR assets now include `icn_m_devices.svg` in the preload exclusion list.
- Every local image warmup settles after at most 1800 ms; the overall visual gate fails open after 2200 ms while background cache warmup remains page-session scoped.
- Font readiness also has a 3000 ms recovery ceiling.
- Preserved the prior routing fix: BackButton visibility is stack-depth driven and nested→nested back does not hide/show the native control.
- Preserved product rules: all scale-based pressed states are 0.985; Japan banner surface itself has no pressed state; navigation AppTabBar keeps `rgba(10,12,15,.72)` + 11.2 px blur.


## 2026-09-02 — fast first render + non-starving visual prewarm

- Removed the whole local-visual queue from App's global readiness gate. The previous 2200 ms visual gate made mobile startup feel artificially slow even when the UI itself was ready.
- Global initial skeleton now gates only fonts, with a 1200 ms fail-open ceiling.
- Local visuals still start warming before React render, but the queue is priority-sorted and limited to 6 concurrent requests instead of starting ~70 detached images at once.
- Telegram profile photo starts first/high-priority; referral video warmup is deferred to idle/400 ms.
- Profile avatar skeleton now has a 1200 ms visual ceiling: after that the local fallback appears while the remote photo may continue loading.
- Preserved prior navigation/product rules: stack-depth native BackButton stability; all scale-based pressed = 0.985; Japan banner surface has no press; navigation AppTabBar keeps its translucent background + blur.


## 2026-09-02 — startup contention audit after ~5 s skeleton report

- The issue was not raw 100 Mbps bandwidth. Startup was doing too much speculative work at once.
- Found a concrete heavy initial-bundle item: `sakura_falling_vector.json` is ~466 KB and was statically imported together with `lottie-web`. Sakura now renders a tiny local poster immediately and dynamic-imports both after first paint/idle.
- Main referral smile previously mounted six SVG state files immediately; four are ~66 KB each. It now renders the ~2 KB poster first and mounts exact animation SVGs later.
- Visual prewarm no longer begins requests before first React paint. Route icons/avatar warm shortly after paint; pulse/decorative assets and referral video are idle/deferred.
- Global App skeleton does not wait for visual prewarm at all; it only waits for fonts with a 1200 ms fail-open ceiling.
- Preserved locked rules: all scale-based pressed = 0.985; Japan banner surface no press; navigation AppTabBar keeps its translucent background + blur; native BackButton remains stack-depth driven.


## 2026-09-02 — Sakura runtime switched from 477 KB JSON to 18 KB .lottie

- `sakura_falling_vector.lottie` is 18,768 bytes and contains the exact same 477,339-byte animation JSON as the old source file.
- Sakura runtime no longer imports `sakura_falling_vector.json`; after equivalence verification the unpacked JSON file was removed entirely.
- Added `src/utils/dotLottie.js`: reads the local dotLottie ZIP manifest and animation entry and decompresses deflate data through native `DecompressionStream('deflate-raw')`.
- Existing `lottie-web` remains the renderer and is still dynamic/idle-loaded; no second dotLottie player dependency or external runtime CDN was added.
- If extraction is unsupported/fails, Sakura simply keeps the tiny poster and never blocks the app.


## 2026-09-02 — do not replay visual loading on every screen revisit

- Fixed the repeated-loading feel when reopening a screen long after entering the app.
- Profile avatar now caches per-URL session outcome (`loaded`, `slow`, `failed`): the same remote avatar skeleton is shown only on its first unresolved attempt. A slow/failed URL reopens directly with fallback, while a loaded URL reopens directly with the photo.
- dotLottie parsed animation data is cached by URL for the page session, so Sakura does not refetch/reinflate its 18 KB container on every Main remount.
- Sakura keeps its idle delay only until it has successfully rendered once; repeat Main visits start immediately from cached animation data.
- ReferralSmile's poster→animation defer happens only once per page session; repeat mounts render the already-activated animation state immediately.
- Product rules remain unchanged: pressed scale 0.985, Japan banner surface has no pressed state, AppTabBar background retained, native BackButton stack-depth driven.


## 2026-09-02 — Main referral Block no pressed state

- Removed scale/pressed feedback from the whole `пригласи друга` Block on Main.
- The Block remains fully clickable and keyboard-accessible.
- Share/Copy controls inside keep their own standard `0.985` Button/IconButton pressed feedback.
- This joins the Japan banner surface as an explicit no-pressed container exception.


## 2026-09-02 — Main resync + purchased Country variations

- Re-read current Main `6429:29217`, location-data component `5335:15751`, active/no-limit Country `7261:26032`, limit Country `6447:27934`, and technical-works Country `6520:46426`.
- Main purchased cards now navigate: Germany → active, Lithuania → maintenance, Kazakhstan → limit. All use the existing `SCREEN.COUNTRY`.
- Added `location.accessState`; active / limit / maintenance are presentation variations of `CountryScreen`, never standalone routes/entities.
- Current available Main values resynced: BittRussia 114 ₽ / 923 ms; Japan 367 ₽ / 33 ms; `/доступные локации` now shows `Все`.
- Purchased Country variations add active-access expiry/latency stats, `/мои устройства`, renewal CTA; limit adds warning count/notice/upsell; maintenance adds top tech-work notice, offline state and latency dash.
- Shared warning/calendar/cross assets come from the existing product icon pack; device rows use durable local dot-matrix platform SVGs.
- Preserved product rules: any existing scale-based pressed feedback = 0.985; Japan banner and Main referral surface have no pressed scale; navigation AppTabBar background remains.


## 2026-09-02 — Main resync + Country purchased variations wired as one screen

- Re-read current Main `6429:29217` and current card-data component `5335:15751`.
- Main now keeps 20 px horizontal product insets and current purchased/available data.
- Purchased Main cards route by location into one `SCREEN.COUNTRY`: Germany → active/no-limit `7261:26032`, Lithuania → technical works `6520:46426`, Kazakhstan → limit `6447:27934`.
- AppShell's Country Figma node is now derived from `selectedLocation.accessState`; no extra screen constants/routes were added.
- Main maintenance Ping now uses the actual offline gray state; limit warning usage no longer gets the normal bullet separator before ping.
- Documented the existing `CountryNotice` and `PurchasedDevices` reusable features.
- Locked rules preserved: all scale-based pressed = 0.985; Main referral Block and Japan banner surface have no pressed state; AppTabBar background remains.


## 2026-09-02 — CountryScreen barrel named export compile fix

- Fixed CRA compile error: `COUNTRY_SCREEN_FIGMA_NODES` existed in `CountryScreen.js` but was not re-exported by `src/screens/CountryScreen/index.js`.
- Barrel now exports both `default` and `COUNTRY_SCREEN_FIGMA_NODES`.


## 2026-09-02 — Main/Country warning visuals + supplied device icons

- Re-read current Main `6429:29217`, limit devices bar `6447:27943`, warning notice `6521:49043`, and device Card `6447:27949`.
- Replaced all four purchased-device platform glyph files byte-for-byte with the user-supplied dotted Apple/Android/Windows/Linux SVGs from `dots.zip`.
- Main limit metadata now has 4 px warning-icon/copy gap and warning yellow `#FFC300`.
- Removed the extra literal current-card separator bullet. Ping owns the single status dot, fixing the two-dot `Техработы` regression.
- Recolored the local 16 px and 24 px circle-warning glyph assets to warning yellow for their warning-only usages.
- Country limit `6/6` now reuses shared `Button size=xsmall type=outlined form=circle color=warning`, matching the established `Все` Button family and its correct 15% dotted warning border.


## 2026-09-02 — available LocationCard price alignment + separator rhythm

- Re-read current available card `5335:16084` and its data master `5335:15752`.
- Price Button is now top-aligned within the 44 px top row.
- Replaced browser-native dotted border with the controlled Figma separator rhythm: 2 px visible mark / 2 px gap, border-primary at 20%.
- Bottom metadata structure now mirrors Figma: 52 px left inset → separator → 8 px gap → metadata bar.


## 2026-09-03 — Purchase BottomSheet CTA baseline = PurchaseTabBar baseline

- Re-read current purchase BottomSheet instance `7171:123356`.
- Figma geometry is explicit: sheet bottom safe area is 34 px at the iOS reference; ButtonGroup is 76 px with a 56 px CTA aligned to its top, leaving 20 px below the button. Therefore CTA bottom sits 54 px above the device bottom.
- `PurchaseTabBar` already uses `20px + var(--app-safe-bottom)`, i.e. the same 54 px at that reference.
- Added BottomSheet `bottomSafeArea="tabbar"` = `var(--app-safe-bottom)` and applied it only to PurchaseDurationSheet. Its existing 20 px ButtonGroup tail now completes the exact tabbar baseline on both desktop (20 px) and mobile (20 px + safe area).
- Removed product-side BottomSheet bottom corner radii (`36px 36px 0 0`); mobile viewport clipping supplies device rounding, while desktop no longer shows fake lower rounded corners.


## 2026-09-03 — dot-matrix trash ↔ check morph foundation

- Studied Morphicons' actual contract: it expects stroke centerlines; filled dot-circle SVGs are not suitable as direct morph input.
- Implemented the product-owner idea at the geometry level: contiguous rows/columns of the exact dot SVGs are collapsed into stroke subpaths, then rendered with a round-capped dotted stroke.
- Exact source endpoints:
  - trash: 50 circles → 10 subpaths
  - check: 22 circles → 12 subpaths
  - 64×64 grid, dot diameter 3.12110, pitch 4.68360.
- Raster comparison at 512×512 returned RMSE 0 / AE 0 for both generated stroke endpoints versus the supplied SVGs.
- Added `DotMorphIcon`: semantic `icon="trash" | "check"` state, Morphicons `snappy` spring, mid-flight reversibility, `reducedMotion="user"`, and an exact static SVG fallback while the Morphicons chunk loads.
- Morphicons is dynamically imported and page-session cached. The component is intentionally not added to the shared UI barrel yet to avoid optional animation code entering ordinary screen startup.
- Added exact source SVGs plus `scripts/generate-dot-morph-icons.cjs` so future dot pairs can be regenerated instead of hand-authored.
- Chose runtime morphing over Lottie for this interaction: it is reversible/interruptible and avoids authoring a dedicated animation file per state pair.


## 2026-09-03 — purchased-device long-press delete flow + context delete

- Implemented delete mode from current Figma `6466:34197` as state inside the existing purchased Country screen.
- 420 ms Card hold enters selection mode with standard 0.985 press; >10 px pointer movement cancels long-press for scrolling.
- Selection uses exact CheckboxLabel on/off assets, dynamic selected-count copy, `Отмена`, and danger delete AppTabBar.
- `…` now opens current ContextMenu `6532:50422`: Download / Instruction / danger Delete / separator / Select. Outside tap, scroll, resize and Escape close it.
- Context-menu Delete opens single confirmation `7297:38422`; selection delete uses dynamic multi confirmation matching `7297:33612`.
- Confirmed delete enters overlay-only pending `7297:38553`, then success sheet `7299:39655`.
- Integrated the previously prepared DotMorphIcon: success mounts at trash and morphs to check. The Morphicons engine is idle-preloaded only on purchased Country.
- Success auto-closes after 3 seconds or normal BottomSheet dismissal.
- Added optional async `onDeleteDevices(ids)` hook; prototype fallback delay is 650 ms. Successful prototype deletion removes devices locally and recomputes at-limit warning state.
- Country renewal tabbar is hidden while device interaction owns the bottom UI, preventing double fixed controls.


## 2026-09-03 — delete sheet gap + real trash→check morph + blurred viewport-safe context menu

- Fixed DeviceDeleteSheet missing data→button spacing: shared BottomSheet was not a flex container, so `gap:32px` had no effect. BottomSheet is now flex-column and the Figma 32 px gap works.
- Replaced the production trash→check engine with deterministic 12-line numeric Motion morphing. The prior Morphicons implementation is retained as an unused experiment because on this multi-subpath dotted pair it only visibly wiggled.
- Production endpoints still use the exact supplied dot geometry; two long trash runs are split at existing dot centers so trash/check both have 12 matched line segments.
- Context overlay `6532:50421` now has the missing 16 px backdrop blur in addition to black 40%.
- Context placement now reads `visualViewport`. Menu remains 8 px below the active Card. If its 217 px height would overflow the visible bottom, the active Card and menu animate upward together by the exact overflow amount instead of clipping/flipping.
- Action-menu Button pressed-state component sync is intentionally deferred to the next pass per product-owner instruction.


## 2026-09-03 — warning emphasis + one CTA bottom baseline

- Re-read Main `6429:29217`, limit counter `6447:27943`, warning notice `6521:49043`, and purchase BottomSheet `7171:123356`.
- Fixed warning over-brightness: compact limit warning text is exactly `rgba(255,195,0,.75)` in Figma. Main limit metadata and the Country `6/6` counter now use 75% warning emphasis; their 16 px warning glyphs follow the same visual opacity. The larger notification warning icon remains full `#FFC300`, and notification copy remains white.
- Added shared `--app-action-safe-bottom = max(32px, var(--app-safe-bottom))`.
- PurchaseDurationSheet `bottomSafeArea="tabbar"` now uses that shared floor. Its internal 76 px ButtonGroup contributes the same 20 px tail as the closed Country renewal tabbar, so both CTA bottoms resolve to `20px + --app-action-safe-bottom`.
- Direct purchase and checkout tabbars now use the same physical CTA baseline. This specifically fixes Telegram/iOS cases where `--app-safe-bottom` can be reported as 0 and the sheet button previously fell ~32 px lower than the tabbar.


## 2026-09-03 — real delete pending sheet + authored 250ms morph + action pressed + sheet layering

- Inspected the actual Figma hierarchy around user-linked `7297:38553`: it is only the overlay child. Its parent screen `7297:38526` also contains pending BottomSheet `7297:38554`. Implemented that missing sheet exactly: trash shell/title + disabled `Удаляем...`.
- Pending now keeps the same DeviceDeleteSheet mounted, is non-dismissible, and has a 650 ms minimum visible floor.
- Replaced the subtle spring wiggle with a fixed 250 ms trash→check animation: dotted trash runs merge into solid rows/columns, those rows/columns move/rotate into matched check positions, then split back to the dotted product check.
- Success stays `7299:39655` and auto-closes after 3 seconds.
- Shared BottomSheet overlay/surface moved to z-index 55/56 above AppTabBar 50. Purchased Country also hides `Продлить доступ` while its duration BottomSheet is open.
- Context-menu rows now use shared Button `type=menu` active state + standard 0.985 press. Active fill eases over 180 ms.
- Context overlay 0→40% + blur 0→16 px now enters over 240 ms instead of snapping.


## 2026-09-03 — device-delete success simplified to base toast

- Removed the success BottomSheet from the current product flow.
- Removed all delete-flow use of DotMorphIcon/morph engine. The old morph/prototype files remain only as unused experiments.
- Confirmation/pending keeps the exact static trash icon; pending remains `7297:38554` with `Удаляем...` and 650 ms minimum visibility.
- After successful deletion, the pending sheet closes, selection state clears, and the existing global `AppToast` is used.
- Toast copy is dynamic Russian pluralization: `Удалено 1 устройство`, `Удалено 2 устройства`, `Удалено 5 устройств`.
- The toast automatically uses the existing inline `icn_m_circle-success-filled` icon and global 5-second/stack/swipe behavior; no delete-specific toast clone was added.
- Threaded the existing App `notify` callback through `CountryScreen` into `PurchasedDevices`.


## 2026-09-03 — Sakura rendered instance persists across Main revisits

- Mobile recording showed the Japan promo poster switching to the sharp Lottie art again on every Main re-entry.
- Root cause: `.lottie` JSON was cached, but `SakuraAnimation` still called `lottie.loadAnimation()` on every mount and `animation.destroy()` on every unmount.
- Added `src/utils/sakuraSession.js`, which owns one page-session Lottie module Promise, rendered host DOM node, animation instance and ready state.
- Main mount attaches the retained host in `useLayoutEffect`; unmount only pauses/detaches it. No destroy/rebuild occurs during navigation.
- Once Sakura reaches `DOMLoaded`, repeat Main mounts initialize ready immediately and never intentionally reveal the poster.
- Background asset warmup now initializes the retained Sakura session during idle after first paint.


## 2026-09-03 — restore delete success morph; exact check SVG owns the endpoint

- Product owner clarified that the morph motion itself was acceptable; the malformed final check was the real problem.
- Verified the exact uploaded/source `icn_el_check.svg` contains 22 dots. The previous dashed-line endpoint visible in the mobile screenshot contained only 17 visible dots.
- Restored the success BottomSheet `7299:39655` and removed delete-success toast behavior.
- Kept the authored 250 ms trash row/column morph.
- During the final 70 ms, the intermediate line layer fades out and the exact local 22-dot check SVG fades in. Final artwork is now source-authoritative rather than reconstructed from dash patterns.
- Pending remains the real non-dismissible `7297:38554` sheet with a 650 ms minimum duration.
- Success remains visible for 3 seconds or until normal BottomSheet dismissal.


## 2026-09-03 — smooth DeviceDeleteSheet state resize

- The delete sheet previously dropped downward abruptly when pending/confirmation content disappeared on success.
- Root cause: the action ButtonGroup was conditionally unmounted, so the bottom-anchored auto-height sheet lost ~88–120 px in one layout frame.
- The action slot now remains mounted and animates `120px confirm → 56px pending → 0 success`.
- Sheet gap animates `32px → 0`; title min-height animates `48px → 24px`.
- Resize timing is 360 ms with `cubic-bezier(.2,.8,.2,1)`, while the existing 250 ms trash→check morph is unchanged.


## 2026-09-03 — morph +30% and ContextMenu Navigator-style hold scrub

- Slowed delete trash→check morph by exactly 30%: `250 ms → 325 ms`; phase proportions remain unchanged (`0/.28/.72/1`).
- ContextMenu now mirrors Navigator's continuous hold/scrub selection vertically: 120 ms hold, 6 px vertical drag threshold, active row follows the finger, release executes the highlighted action.
- Optional Telegram selection haptic fires only when scrub crosses into another action.
- Context action rows intentionally have no icons and no scale/shrink pressed effect. Feedback is only the existing `Button type=menu state=active` surface `#242A33` transferring between rows.
- Removed the browser `:active` menu fill fallback so the original pointer-down row cannot stay highlighted while controlled scrub highlight moves to another row.


## 2026-09-03 — Telegram Mini App black-screen compatibility guard

- Web build opened normally while Telegram Mini App could remain entirely black after the retained Sakura-session change.
- Hardened the likely WebView-specific failure path: removed `replaceChildren` and `queueMicrotask` from Sakura session code, using older `appendChild/removeChild` + Promise microtasks instead.
- Sakura attachment is now fail-open in both the session owner and React layout effect; decorative media can no longer crash the React root.
- Referral rain session attachment was hardened the same way (`appendChild/removeChild`, fail-open) to prevent a later route-specific black screen.
- React bootstrap is now independent from Telegram/native integration: Telegram init is guarded, React mounts, and only then optional asset warmup starts.
- `initTelegramWebApp()` now catches detection/class/native-API failures across the entire initialization path and falls back to ordinary browser rendering.


## 2026-09-03 — delete morph slowed and softened again

- Device feedback: the 325 ms morph still read as abrupt on phone.
- Slowed trash→check to **450 ms**.
- Rebalanced phase timing from `0/.28/.72/1` to `0/.22/.76/1`, giving the actual line travel ~243 ms instead of ~143 ms.
- Switched geometry/final-check fade to symmetric `cubic-bezier(.45,0,.55,1)` so acceleration/deceleration is less punchy.
- Exact 22-dot check SVG remains the authoritative final endpoint.
- ContextMenu hold/scrub interaction was intentionally left unchanged so active state continues to track the finger without lag.


## 2026-09-04 — slower pending→success sheet shrink + ContextMenu hold stability

- Pending→success DeviceDeleteSheet still felt like it dropped too quickly even after the generic 360 ms resize fix.
- Success geometry now uses 620 ms + 40 ms delay with `cubic-bezier(.22,1,.36,1)`; confirm→pending remains 360 ms.
- This intentionally lets the current 450 ms trash→check morph start before the bottom sheet begins its longer collapse.
- ContextMenu hold/scrub could immediately lose its overlay in Telegram because `PurchasedDevices` closed the menu on any global `scroll`, and some WebViews emit an incidental scroll event when a long hold starts.
- Removed scroll-as-close for ContextMenu, added `touch-action:none`, disabled native touch callout/contextmenu. Outside tap, resize, Escape and selection still close normally.


## 2026-09-04 — ContextMenu scrub active focus fill

- React was already transferring `state=active` to the action row under the finger, but the focused row stayed visually transparent.
- Root cause: the later local `.bitt-context-menu__item.bitt-button { background:transparent; }` rule overrode the shared menu active background.
- Added a later/more-specific ContextMenu active rule with `background:#242A33`.
- Added `data-scrub-active=true` on the focused Button for inspection.
- No scale effect was reintroduced.


## 2026-09-04 — resync delete success to Figma 7318:30920

- Re-read current Figma success screen `7318:30920` and concrete BottomSheet `7318:30948`.
- Success copy is now `Устройство было удалено`.
- The 56 px ButtonGroup remains present and disabled with label `Готово`; it no longer disappears on success.
- The 32 px data→button gap remains present.
- At the 34 px iOS safe-bottom reference: 44 top + 138 data + 32 gap + 56 button + 54 bottom = 324 px.
- Therefore pending→success only shrinks 24 px (348→324), instead of collapsing the old action area.
- Existing 450 ms morph, exact 22-dot check endpoint, 3 s auto-close, ContextMenu scrub/focus fixes, and Telegram compatibility guards are preserved.


## 2026-09-04 — success `Готово` button enabled

- Product behavior intentionally overrides the disabled Button state shown in Figma `7318:30948`.
- `Готово` remains the same 56 px primary/accent action in the success BottomSheet, but is now enabled.
- Tapping `Готово` calls the existing success `onClose` immediately.
- The existing 3-second auto-close remains as a fallback.
- Success sheet geometry, 450 ms morph, 324 px reference height, ContextMenu scrub/focus fixes, and Telegram guards are unchanged.


## 2026-09-04 — `Готово` exact Figma Button variant

- Re-inspected current Figma `7318:30948` programmatically.
- Nested Button instance `I7318:30948;7297:35166;5943:17032` is exactly:
  `size=large, type=secondary, form=circle, color=elevated, state=default`.
- Replaced the incorrect product implementation `primary / accent`.
- `Готово` remains enabled and still closes the success BottomSheet immediately on tap.

## Shared bottom surfaces consolidation (2026-09-06)

- `AppTabBar` is now the only owner of tabbar fixed positioning, top/side/bottom padding, safe-area floor, button/navigation wrapper heights, blur/surface and top-only radius.
- `NavigatorDock` delegates to `AppTabBar type="navigation"`; Main/Profile no longer maintain a separate dock layout implementation.
- All scrolling screens reserve shared `--app-tabbar-button-content-reserve` or `--app-tabbar-navigation-content-reserve` tokens instead of local `56 + 20 + safe` formulas.
- `BottomSheet` now has one outer geometry for every instance: 44 px top, 20 px sides, 32 px direct-child gap and `20px + --app-action-safe-bottom` bottom. The former `bottomSafeArea` modes were removed.
- Feature CSS may animate/size inner sheet contents and buttons, but may not override AppTabBar/BottomSheet shell geometry.


## 2026-09-06 — rollback global bottom-spacing normalization

- Restored Main/Profile/Country/Checkout/Referral/HistoryDetail to their pre-normalization screen-owned bottom reserves; changing TabBar/BottomSheet no longer shifts every page.
- AppTabBar now exposes exactly two visual variants: `navigation` (`5948:20583`, no outer surface) and `action` (`5948:20740`, one shared glass CTA surface).
- Removed the transparent `safearea` AppTabBar usage from Country overlay ownership; overlays hide renewal without creating a third tabbar type.
- BottomSheet remains one shared shell from `7166:122124`; bottom clearance corrected to `20px + system safe bottom`, with 36 px top-only radii and no per-sheet safe-area mode.
- Existing waiting → paid 450 ms timer→check morph is preserved.

### Action TabBar CTA baseline +2 px

- Kept navigation TabBar on its existing 32 px minimum bottom floor.
- Changed only the action TabBar bottom floor to 34 px. With the 76 px action wrapper around the 56 px CTA, this places the CTA bottom 54 px from the viewport edge, matching the shared BottomSheet CTA baseline.
- No screen content reserve, BottomSheet geometry, or navigation spacing was changed.



## 2026-09-07 — action TabBar / BottomSheet safe-area baseline fix
- Fixed the remaining CTA baseline drift between `AppTabBar type="action"` and `BottomSheet`.
- Root cause: action TabBar used `app-safe-bottom = max(content-safe-bottom, system-safe-bottom)` while BottomSheet used system safe-area only. Telegram fullscreen reported content-safe-bottom 6px larger on device, so action CTA sat 6px lower.
- `--app-action-safe-bottom` now uses `max(34px, var(--system-safe-bottom))`. The 20px tail in the 76px action slot therefore resolves to the same bottom baseline as BottomSheet's `20px + system-safe-bottom`.
- Navigation safe-area behavior is unchanged. No screen/content paddings were modified.

## 2026-09-07 — hard-lock action / BottomSheet CTA baseline

- Replaced the two separate-but-equivalent bottom-baseline formulas with one shared token: `--app-bottom-cta-clearance`.
- `AppTabBar type=action` current no-subline state now uses the real 56 px CTA slot and the shared clearance directly; the former invisible 20 px tail inside a forced 76 px slot is removed.
- `BottomSheet` uses that exact same token as its bottom padding.
- At the 34 px Figma/iOS safe-bottom reference both CTA bottom edges resolve to exactly 54 px from the viewport edge; larger system safe areas move both together.
- Optional action subline behavior is preserved: 4 px gap + 16 px subline occupies the 20 px tail and reduces shell padding by the same amount, so the CTA baseline stays fixed.
- Navigation TabBar and every screen-owned content reserve remain untouched.



## 2026-09-07 — Purchase/Renew BottomSheet CTA baseline
- Fixed the duration-sheet CTA rising above the shared action-tabbar baseline.
- Root cause was an obsolete 76 px `.sheet-button-slot` (56 px button + 20 px tail) combined with BottomSheet already owning the complete bottom clearance.
- `.sheet-button-slot` is now exactly 56 px; no screen/shell/safe-area geometry was changed.
