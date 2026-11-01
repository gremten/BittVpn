# PaymentBreakdown

**Source:** `src/features/checkout/PaymentBreakdown.js`

## Purpose

Conditional checkout price breakdown.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `accessCost` | `required/controlled by caller` |
| `originalAccessCost` | `required/controlled by caller` |
| `discountAmount` | `required/controlled by caller` |
| `extraDevices` | `required/controlled by caller` |
| `extraDevicesCost` | `required/controlled by caller` |
| `bonusAmount` | `required/controlled by caller` |
| `total` | `required/controlled by caller` |

## Invariants

- Do not render zero/non-applicable rows just to fill space; optional lines stay conditional.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/checkout/PaymentBreakdown.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `PaymentBreakdown.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
