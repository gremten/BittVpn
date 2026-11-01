# Figma internal-component audit

Source file: `5ks9FYkDbV4fcg60G4SLjf`, userflow page `7:69`.

This pass changes the interpretation of Figma names marked `🔒`: they are
internal implementation primitives, not components to ignore. Public React APIs
remain top-level (`Button`, `LocationCard`, etc.), while locked masters are used
inside those composites.

## Verified and mirrored

- `LocationCard` `5941:18084`
  - `🔒 card location data` `5335:15751`
  - current `5335:15750`
  - available `5335:15752`
- Ping inside purchased cards
  - `🔒 ping` `5335:15616`
  - low `5335:15615`, medium `5335:15617`, high `5335:15623`
  - `🔒 _/master ping blinking` `4984:5580`
  - exact 1.2px glow → 2.4px dot timing reproduced from prototype reactions
- Detail rows
  - `🔒 row` `5964:23500`
  - regular `5964:23499`, end `5964:23501`
  - shared by country characteristics and checkout summary
- Country hero `6466:30120`
  - `🔒 block country-control data` `5964:23163`
  - online badge corrected to Figma `xsmall` / 24px
  - city marker reuses the locked ping primitive
- Checkout `6606:23733`
  - bonus selector is implemented as a dedicated `SegmentedControl`: it keeps the Figma master-button geometry, but the active elevated pill snaps between equal slots on click or horizontal drag
  - two option slots are equal-width, matching the 161px / 161px Figma layout
- `IconButton` `5928:21084`
  - icon sizes: 16px for xsmall/small, 24px for medium/large
  - squircle radii: 8 / 12 / 16 / 16
  - frost: `rgba(36,42,51,.75)` + 2px blur
- `Card` `5941:17273`
  - warning state corrected to `#27210E`

## Outlined controls

Do not reintroduce SVG borders. The approved scalable web treatment stays on
the real control box:

```css
border: 1.5px dotted rgba(233, 240, 243, .20);
```

This preserves native HUG/fill behavior while visually matching Figma's
`dashPattern [0.1, 3]` with round caps. The same treatment is now used by
outlined `IconButton` as well.

## Product-specific deviations intentionally preserved

- Real Telegram native chrome/safe areas replace simulated iPhone/TMA chrome in
  Figma screens.
- Extra-device product price remains 69 ₽ as specified for the prototype, even
  where an older Figma sample contains 99 ₽.
- Main uses the approved standalone Navigator rather than the old blurred
  AppTabBar shell.
