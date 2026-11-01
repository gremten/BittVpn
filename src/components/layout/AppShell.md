# AppShell

**Source:** `src/components/layout/AppShell.js`

## Purpose

Global application shell and Figma-node marker wrapper.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | `required/controlled by caller` |
| `figmaNode` | `required/controlled by caller` |

## Invariants

- Keep shell concerns global; feature-specific UI belongs in screens/features.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/layout/AppShell.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `AppShell.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
