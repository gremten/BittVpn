# NavigatorDock

**Source:** `src/components/layout/NavigatorDock.js`

## Purpose

Compatibility wrapper used by Main/Profile. It delegates directly to the shared navigation variant: `AppTabBar type="navigation"`.

It owns no visual surface and no geometry.

## Props / API

| Prop | Ownership |
| --- | --- |
| `selected` | controlled by caller |
| `onSelect` | controlled by caller |

There is no `className` forwarding: Main/Profile cannot override the shared navigation tabbar shell.

## Invariants

- Figma navigation source is `5948:20583` within component set `5948:20739`.
- The navigation tabbar outer area is visually transparent; only `Navigator` is the black rounded pill.
- Do not add action-tabbar background, blur or corner radius here.
- Do not recreate fixed positioning, padding, safe-area, bottom spacing or desktop handling here.
- Main/Profile content reserve stays `--app-tabbar-navigation-content-reserve`.

## Documentation update rule

Update this file if the wrapper role or AppTabBar navigation contract changes.
