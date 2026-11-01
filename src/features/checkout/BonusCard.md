# BonusCard

**Source:** `src/features/checkout/BonusCard.js`

## Purpose

Checkout card for applying referral/bonus balance.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `enabled` | `required/controlled by caller` |
| `onChange` | `required/controlled by caller` |
| `onInfo` | opens the bonus-balance information BottomSheet |
| `infoOpen` | `false`; mirrors sheet state for `aria-expanded` |

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/checkout/BonusCard.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `BonusCard.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Current Figma behavior

- Current checkout reference is `7223:25096`.
- Heading is `бонусный баланс`.
- The 16×16 `icn_s_circle-info` glyph is **icon/action/primary / white**. The implementation forces the durable local icon to primary white and does not apply a gray/secondary opacity.
- The glyph sits inside a transparent 24×24 button so the visual geometry remains the Figma 16 px icon while the interaction target is usable. The button has no filled pressed state.
- Tapping it opens `BonusBalanceSheet`; the button exposes `aria-haspopup="dialog"` / `aria-expanded`.
