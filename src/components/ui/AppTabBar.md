# AppTabBar

**Source:** `src/components/ui/AppTabBar.js`

## Purpose

One shared fixed bottom component with exactly two visual variants.

## Figma source

- component family: `5948:20739`
- navigation: `5948:20583`
- action / button-only design state: `5948:20740`

## Variants

### `type="navigation"`

- Main/Profile bottom navigation.
- The only visible surface is the black `Navigator` pill.
- The fixed host is transparent: no full-width plate, no background, no blur, no radius.
- Figma positioning uses 20 px top/side spacing, a 72 px layout slot and a 32 px minimum bottom safe-area floor.
- Navigation spacing is independent from action/BottomSheet CTA alignment.

### `type="action"`

- Purchase, renewal, Checkout, Referral, HistoryDetail, payment imitation and delete-selection CTA.
- One shared glass surface: `rgba(22,26,32,.8)` + 11.2 px backdrop blur.
- 36 px top radii, square bottom corners.
- 20 px top/side padding.
- Current product action usages have no external subline, so the content slot is the real 56 px CTA height rather than a hidden 76 px spacer.
- The CTA bottom edge uses `--app-bottom-cta-clearance`, the exact same token used by `BottomSheet`. At the Figma/iOS 34 px safe-bottom reference this resolves to 54 px from the viewport edge.
- If the optional 16 px subline is used later, its 4 px gap + 16 px line occupy the 20 px tail and the shell reduces bottom padding by that same amount, preserving the same CTA baseline.

## API

| Prop | Notes |
| --- | --- |
| `type` | `navigation` or `action` |
| `selected`, `onSelect` | navigation only |
| `children` | action content |
| `label`, `subline`, `showSubtle` | action convenience API |
| `hidden` | shared action exit motion |

## Invariant

No screen/feature CSS may override AppTabBar root padding, height, background, blur, radius, fixed positioning, bottom offset or safe-area math. Screens may style only their inner Button/copy.

The action CTA baseline and BottomSheet CTA baseline must never be calculated independently. Both use `--app-bottom-cta-clearance`.

Screen scroll padding is deliberately **not** derived from AppTabBar component tokens. Each existing screen keeps its established content reserve so a component resync cannot shift every page at once.
