# SlotsNotice

**Source:** `src/features/country/SlotsNotice.js`

## Purpose

Country-screen Card about the 5 included device slots. On the available/not-yet-purchased Country state it is also the entry point to the informational slots BottomSheet.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Current Card: `7181:25036` inside screen state `7181:25029`.
- Previous static Card reference: `7176:124489`.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `onClick` | optional; CountryScreen opens `SlotsInfoSheet` for the available-country flow |

## Verified layout

- Reuses the shared `Card` family rather than `Block`.
- Surface: `bg/surface`, radius **16 px**, padding **16 px**.
- Content is a 24 px leading icon + copy with **12 px** horizontal gap.
- Title: Golos UI **14/18**.
- Caption: Golos UI **12/16**, secondary text.
- Durable local icon: `src/assets/icons/icn_m_devices.svg`, copied byte-for-byte from the user-provided `icn_m_devices.zip`. It is rendered through CRA/SVGR as an inline React SVG component rather than `<img>`, because the WebView showed a broken-image placeholder for the external SVG resource.

## Interaction

- Supplying `onClick` makes the shared Card keyboard/tap/click interactive through its existing semantics.
- The Card itself owns no modal state. CountryScreen owns opening/closing `SlotsInfoSheet`.
- No custom pressed scale is added; the visual surface remains the Figma Card.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/country/SlotsNotice.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `SlotsNotice.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
