# BitVPN UI components

This folder is the code-level mirror of the reusable component families on the
Figma page `🛠️ Userflow и прототипирование` (`7:69`).

Public API rule: top-level Figma families remain the components exported from
`components/ui`. Nodes whose names contain `🔒`, `./`, or `master` are **not
ignored**: they are internal design-system primitives and must be used as the
source of truth for the composition, spacing, states and motion of their parent
components. Code mirrors those primitives under `components/ui/internal` when
reusing them prevents drift, but they are intentionally not re-exported as
public UI components. Individual variant children are collapsed into
parameterized React components.

## Public Figma families

| Code component | Figma node | Figma family / axes |
| --- | --- | --- |
| `LegacyTabBar` | `4745:134` | `tabbar` / Property 1 |
| `Button` | `5335:15155` | size, type, form, color, state |
| `IconButton` | `5928:21084` | size, type, glass, color, form |
| `Card` | `5941:17273` | state |
| `LocationCard` | `5941:18084` | state |
| `Block` | `5943:16932` | state, type |
| `ButtonGroup` | `5943:17729` | type |
| `AppTabBar` | `5948:20739` | type |
| `Navigator` | `5951:24662` | selected |
| `Tabs` | `7435:37032` | state: default / active |
| `Badge` | `5964:23023` | size, color |
| `Cell` | `6432:30801`; payment masters `7370:32485` / `7370:32431` | type, state; payment selection |
| `Chip` | `6436:32497` | size, state |
| `SingleSelectChipGroup` | `6436:32518` | selected |
| `CheckboxLabel` | `6466:33667` | state |
| `OrderStatus` | `6532:49948` | type, state |
| `ContextMenu` | `6464:31187` | standalone component |

The exact allowed axes are also exported as `FIGMA_VARIANTS` from
`components/ui` so future screens use the same vocabulary as Figma.

## BottomSheet

`overlays/BottomSheet` is intentionally content-agnostic. It owns only shell
behavior and presentation: safe area, blur/background, grabber, shadow,
scroll-lock, global downward swipe-to-close and show/hide animation. Feature
content must be passed through `children`.


## Internal Figma primitives

The current implementation explicitly mirrors the locked primitives that affect
implemented screens:

- `🔒 card location data` (`5335:15751`) → `internal/LocationCardData`
- `🔒 ping` (`5335:15616`) + `🔒 _/master ping blinking` (`4984:5580`) → `internal/Ping`
- `🔒 row` (`5964:23500`) → `internal/DetailRow`
- `_/🔒 master button` and `_/🔒 master icnButton` remain implementation specs
  for the public `Button` / `IconButton` APIs.

The dotted web border for outlined controls is intentionally kept on the real
button box (`1.5px dotted rgba(233,240,243,.20)`), because it is the scalable
web equivalent of Figma's `dashPattern [0.1, 3]` with round caps.


## Per-component Markdown contract

Every React component in `src/components`, every feature component in `src/features`, and every screen in `src/screens` has a same-name Markdown file beside its source. Read that file before editing the component and update it in the same change whenever the component's API, Figma source, visual rules, interaction, assets, timing, or invariants change. Root-level `/AGENTS.md` defines the mandatory workflow.

## Shared runtime loading primitive

- `Skeleton` is the shared non-Block/Card loading placeholder. `type="font"` is exactly one final line-height tall; `type="control"` mirrors control geometry. It reuses the canonical Block/Card blinking strip.


## Payment-method rows

The checkout provider list reuses public `Cell` with `type=payment`. Its current selected/default masters are `7370:32485` / `7370:32431`; provider art is local and product-owner supplied. Do not create a second screen-local payment-row clone.
