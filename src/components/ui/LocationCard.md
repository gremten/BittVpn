# LocationCard

**Source:** `src/components/ui/LocationCard.js`

## Purpose

Reusable purchased/available location card.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Node: `5941:18084` — `card location`
- Current available-card instance: `5335:16084`; available data master: `5335:15752`.
- Current data component: `5335:15751`; acquired-location variants include default and limit-warning device metadata.
- Treat the concrete Figma node as the source of geometry, spacing, color, typography and states.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `state` | `'default'` |
| `code` | `'DE'` |
| `title` | `'Country'` |
| `description` | `'Description'` |
| `price` | `required/controlled by caller` |
| `expiry` | `required/controlled by caller` |
| `devices` | `required/controlled by caller` |
| `ping` | numeric ping; may be null when `pingLabel` is used |
| `pingLabel` | optional status text such as `Техработы` |
| `limited` | `false`; renders warning color on the device count (Main has no leading warning icon) |
| `pingLevel` | `required/controlled by caller` |
| `tags` | `[]` |
| `disabled` | `false` |
| `onClick` | `required/controlled by caller` |
| `className` | `required/controlled by caller` |

## Styling

- `src/components/ui/bitt-ui.css`
- Reuse existing tokens from `src/styles/tokens.css`; do not duplicate color/spacing constants locally without a concrete reason.

## Pressed state

- **Product rule:** LocationCard pressed uses `transform: scale(0.985)`.
- This is the same pressed scale as Button, IconButton, Chip, and every other component that uses scale-based press feedback.
- Do not derive a stronger/weaker pressed scale from a Figma component variant during future resyncs unless the product owner explicitly changes this global rule.
- Loading remains the shared 68 px Card skeleton with the canonical blinking strip.

## Invariants

- Country/location cards should reuse this API instead of local card clones.
- `state="loading"` delegates directly to the base `Card` loading state, so location loading always uses the shared Figma skeleton/blinking treatment and never renders `LocationCardData` underneath it.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/ui/LocationCard.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `LocationCard.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.

## Available-card geometry

- In the current available variant (`5335:16084` / data `5335:15752`), the 32 px price Button is aligned to the **top** of the 44 px country row, not vertically centered.
- The lower metadata wrapper starts 52 px from the content left edge.
- Its separator uses the Figma spaced dash/dot rhythm, implemented as **2 px mark + 2 px gap** at border/primary 20%. Do not use browser `border-style:dotted`: WebView/browser dotted borders render much denser and visually turn into a near-solid line.
- Separator → metadata-bar gap is 8 px.
