# OrderStatus

**Source:** `src/components/ui/OrderStatus.js`

## Purpose

Reusable 86×86 order/payment status illustration used by History operation details.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Component node: `6532:49948` — `order status`
- Exact 64 px illustration nodes:
  - success/check: `6532:49916`
  - processing/time: `6532:49926`
  - failure/cross: `6532:49935`

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `type` | `'success'`; supported: `success`, `processing`, `failure` |
| `state` | `'default'`; `loading` replaces the glyph with the Figma skeleton surface |
| `label` | optional legacy text label; detail screens do not use it |
| `className` | optional |
| `icon` | optional local asset override for a domain-specific status illustration |
| `iconSize` | `64`; numeric rendered glyph size in px |
| `morphFrom` | optional transition source. Current supported authored transition: `processing` → `success` |

## Styling / assets

- `src/components/ui/bitt-ui.css`
- Container is exactly **86×86**, radius **20**, `#161A20` in default state.
- Default glyph is **64×64**, white, and comes from durable local PNG exports of the exact Figma vector nodes under `src/assets/icons/order-status/`.
- Domain-specific consumers may still override the glyph with a durable local asset while preserving the same 86×86 status tile. The current History referral detail (`7166:120223`) does **not** override it: it uses the standard success/check illustration.
- Loading surface is `rgba(38,44,59,.6)` with the same shared **30 px / 20% white / 37.5 px blur** blinking treatment as Block/Card; it loops smoothly left → right and resets off-canvas.
- Status meaning is carried by glyph shape and surrounding copy; do not recolor the large illustration green/yellow/red.
- These local images are automatically included in the app's existing background visual-asset warmup.
- Checkout waiting → success may render `morphFrom="processing"`: the local 64×64 hourglass dot matrix morphs into the local 64×64 check over **450 ms**. The motion starts from the exact durable timer PNG, moves the extracted dot centers toward the check geometry, then resolves onto the exact durable check PNG. No Figma runtime asset is used.
- `prefers-reduced-motion` skips the morph and shows the final check immediately.

## Before changing this

1. Read `/AGENTS.md` and this file.
2. Inspect `6532:49948` and the exact relevant illustration node before changing geometry/assets.
3. Never replace the local exports with temporary Figma/MCP runtime URLs.

## Documentation update rule

If `OrderStatus.js` changes in layout, behavior, props, states, assets, timing or Figma source, update this file in the same change.
