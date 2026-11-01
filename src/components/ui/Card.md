# Card

**Source:** `src/components/ui/Card.js`

## Purpose

Reusable card surface and interaction state wrapper.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5941:17273` — `card`
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `children` | rendered only outside `loading`; hidden automatically in `loading` |
| `state` | `'default'` |
| `className` | `required/controlled by caller` |
| `onClick` | `required/controlled by caller` |
| `...rest` | `forwarded` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.


## Loading / skeleton contract

- Figma `5941:17273` defines `state=loading` as the canonical Card loading placeholder: `bg/loading` (`#262C3B`) at 60% opacity, **30 px** white blinking strip at 20% opacity, **37.5 px blur**.
- The blinking strip loops smoothly from completely off the left edge to completely off the right edge and resets only while off-canvas.
- A loading Card is not interactive even if an `onClick` was supplied; it exposes `aria-busy="true"` and suppresses normal children until data is ready.
- **Any asynchronous UI whose final surface is a Card must use `Card state="loading"` while waiting.** Wrapper components such as `LocationCard` inherit this state instead of creating their own loader.
- The default loading Card is at least **68 px** high. Feature-specific wrappers may make the skeleton taller when their final card requires it, while preserving the shared blinking effect.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/Card.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `Card.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
