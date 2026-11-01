# ReferralSmileAnimation

**Source:** `src/components/media/ReferralSmileAnimation.js`

## Purpose

Referral smile/heart illustration used in referral promo surfaces.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `className` | `''` |
| `gap` | `10` |

## Styling

- `src/components/media/ReferralSmileAnimation.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Loading strategy

- First frame uses `src/assets/images/main/referral.png` (~2 KB).
- The six exact SVG animation states are mounted after first paint/idle **only on the first activation in the page session**. Once activated, reopening Main/Referral mounts the animated state immediately instead of deliberately showing the poster delay again. Four face SVGs are ~66 KB each, so the first activation remains deferred.
- Generic visual prewarm does not separately preload these six SVGs; this component owns their deferred loading to avoid duplicate requests.

## Invariants

- Keep local assets and the established smile/heart composition; do not replace with emoji or approximate glyphs.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/media/ReferralSmileAnimation.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `ReferralSmileAnimation.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
