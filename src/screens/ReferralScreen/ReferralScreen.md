# ReferralScreen

**Source:** `src/screens/ReferralScreen/ReferralScreen.js`

## Purpose

Referral details screen DOM state.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `6995:114597` — `t-profile | referral`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `onNotify` | `required/controlled by caller`; returns the created toast id |
| `activeToastIds` | `Set` from `App`; passed to `CopyIconButton` so its check state follows its own toast |
| `state` | `'default'`; optional `'empty'` implements Figma `7074:118527` without changing the populated state |

## Verified Figma details

- **Empty-state headline typography is local to `7074:118527`:** `Пригласи друга` uses Martian Grotesk medium **24/32**. The populated balance typography remains **32/40**; do not apply the empty-state override globally.
- Empty state keeps the same referral link + benefits + share CTA, but omits the two numeric stat cards and changes the top copy to `Пригласи друга` / `Поделись ссылкой или скопируй её`.

- Current balance caption is **`Для покупок в BittVPN`**.
- Current second benefit caption is **`Бонусы начисляются автоматически`**.
- Benefit-row separators follow the current Figma separator treatment: 1 px dashed `border/primary` at 20% opacity; the terminal row has no separator.
- Stats icons use the current local Figma exports:
  - `icn_m_friends` → `6419:32236`, 24×24
  - `icn_m_bonus` → `6419:32088`, 24×24
- Benefit block: `6995:114637`, 362×212. Its text-cell column is 176 px tall with rows **56 px / 56 px / 40 px** and **12 px** gaps. The final cell has no separator/padding tail.
- Benefit markers were also rechecked against current Figma primitives `6994:113312` (regular dotline, 10.49×67.039) and `6994:113277` (end dot, 10.49×10.49). Their local SVGs are `src/assets/icons/referral/benefit-dotline.svg` and `benefit-dot.svg`; marker column width is 19.49 px with 1.125 px gaps.
- Matrix rain runtime now uses a lightweight local MP4 transcode of the approved original GIF source (`bitmap_matrix_rain_600x440_wave_slow.gif` → `bitmap_matrix_rain_600x440_wave_slow.mp4`). This preserves the original fully rasterized dots/gradients/row integrity and avoids Lottie reconstruction artifacts.
- Visual opacity is **20% on the final composed layer** (`.referral-rain-video { opacity: .2; }`). Timing and structural clipping stay unchanged.

## Styling

- `src/screens/ReferralScreen/ReferralScreen.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Invariants

- This is a screen component rendered by App state, not a separate URL/page.
- Matrix rain stays a separate media layer and ends exactly at the stats lower boundary.
- Main CTA uses share behavior; Copy remains a separate action.
- Do not add unapproved affiliate dashboards, charts, rankings or referral lists.

- Copy buttons keep their check state and disabled state until the exact toast created by that button has fully disappeared from the global toast stack.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/screens/ReferralScreen/ReferralScreen.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ReferralScreen.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
## Fixed CTA geometry

The share CTA uses canonical `AppTabBar type="action"` geometry with no local root override. Referral keeps its established screen-owned bottom reserve (`56 + 20 + 24 + max(32, safe-bottom)`).
