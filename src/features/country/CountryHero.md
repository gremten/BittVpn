# CountryHero

**Source:** `src/features/country/CountryHero.js`

## Purpose

Country detail hero/header content.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `countryName` | `required/controlled by caller` |
| `city` | `required/controlled by caller` |
| `status` | `'online'`; `'offline'` removes the online icon/city ping and shows `Не в сети` |

## State behavior

- Available/active/limit variations keep `Онлайн` and the static green city marker.
- Technical works (`6520:46426`) uses `status="offline"`: status badge reads `Не в сети`, has no online icon, and the city label has no ping marker.
- This is a state of the same hero component, not a second hero/screen.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/features/country/CountryHero.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `CountryHero.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
