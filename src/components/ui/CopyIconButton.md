# CopyIconButton

**Source:** `src/components/ui/CopyIconButton.js`

## Purpose

Icon button with copy → check feedback whose lifetime is tied to the exact global toast created by that button press.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `copyText` | required/controlled by caller |
| `onCopy` | callback that must return the created toast id when toast-coupled feedback is required |
| `activeToastIds` | `Set` of toast ids that are still visually present/closing, owned by `App` |
| `ariaLabel` | `'Копировать'` |
| `className` | optional |
| `disabled` | optional external disabled state |
| `...iconButtonProps` | forwarded |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Figma source and local assets

- Copy animation component: `6029:123` — `icn_m_copy`.
- Default icon: `6029:122`; local exact export: `src/assets/icons/nav/icn_m_copy.svg`.
- Completed check state: `6029:157` (`Variant10`); local exact export: `src/assets/icons/nav/icn_m_check.svg`.
- The local SVGs were re-exported/verified against the current Figma nodes; do not replace them with generic copy/check glyphs.

## Interaction contract

- A successful press copies `copyText`, calls `onCopy`, stores the returned toast id and switches to the check state.
- The button is **actually disabled** while its own toast id remains in `activeToastIds`; repeated presses are not allowed in check state.
- The check does not use an independent 3-second reset timer anymore.
- The icon returns to copy only after the exact toast created by this button has fully disappeared from the global toast stack (including the short automatic exit animation).
- Multiple copy buttons may therefore each own a different active toast/check state at the same time.
- Copy is an action only; do not let it trigger parent navigation.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/CopyIconButton.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `CopyIconButton.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
