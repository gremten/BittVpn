# Skeleton

**Source:** `src/components/ui/Skeleton.js`

## Purpose

Shared loading placeholder for content that is **not already a `Block` or `Card`**.

`Block` and `Card` keep owning their own `state="loading"` surfaces. `Skeleton` is for independent text and controls so fallback fonts or half-loaded controls never flash on screen.

## Source specification

The component follows the product-owner skeleton specification supplied on 2026-08-26:

- `type="font"` has a height exactly equal to the final text **line-height** and an approximate width matching the text it replaces.
- `type="control"` mirrors the final base control width, height and corner radius.
- Both use the same canonical BittVPN loading surface/blinking treatment as Block/Card: `bg/loading` at 60%, 30 px white strip at 20% opacity, 37.5 px blur, smoothly looping left → right off-canvas.

## Props / API

| Prop | Default | Contract |
| --- | --- | --- |
| `type` | `font` | `font` or `control` |
| `width` | `100%` | CSS length or number in px |
| `lineHeight` | `20` | Font skeleton height in px/CSS length |
| `height` | — | Control skeleton height; ignored for `font` |
| `radius` | `999` for font / `12` for control | CSS length or px number |
| `className` | — | Optional styling hook |

## Loading contract

- Do not show fallback text while a required app font is still loading. Use a `font` skeleton with the final line-height.
- Do not create ad-hoc gray rectangles in screen CSS. Use this component.
- If the final thing is a `Block` or `Card`, use that component's `state="loading"` instead of nesting `Skeleton` inside it.
- `prefers-reduced-motion` keeps the skeleton visible but stops the moving strip.

## Documentation update rule

Update this file whenever the component API, geometry, loading behavior or animation changes.
