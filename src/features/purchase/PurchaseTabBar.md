# PurchaseTabBar

**Source:** `src/features/purchase/PurchaseTabBar.js`

## Purpose

Country purchase CTA/tabbar showing price and buy action.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `pricePerMonth` | `required/controlled by caller` |
| `onBuy` | `required/controlled by caller` |
| `hidden` | `required/controlled by caller` |

## Layout contract

- The outer fixed CTA is the shared `AppTabBar type="action"`; `purchase.css` must not set its padding, radius, surface, safe-area, wrapper height or desktop positioning.
- `hidden` is forwarded to the shared AppTabBar `hidden` state, so even the sheet-open exit motion is component-owned.
- `purchase.css` styles only the purchase Button/copy and duration-sheet content.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/purchase/PurchaseTabBar.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `PurchaseTabBar.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
