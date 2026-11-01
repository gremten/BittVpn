# CountrySpecificationsScreen

**Source:** `src/screens/CountrySpecificationsScreen/CountrySpecificationsScreen.js`

## Purpose

Nested country technical-specifications screen opened from the compact `/характеристики` section on Country.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Node: `7172:124235` — `t-country | specifications`
- Telegram/iOS header and Home Indicator visible in the prototype are host chrome and are **not** rendered in product DOM.

## Navigation

- Country → Specifications is an internal nested screen-state push owned by `App`.
- Telegram BackButton returns Specifications → Country.
- Both the compact `Все` button and the characteristics Block on Country open this screen.

## Layout

- Product content uses **20 px** horizontal insets, **24 px** between specification groups, and **12 px** from group heading to table.
- Every table owns a dedicated vertical rows wrapper with **12 px gap between `DetailRow`s**. This gap is part of the Figma table composition; omitting it compresses the tables and is the cause of the previously broken runtime screen.
- Exact resulting table heights from current `7172:124235`: network **272 px**, protocol **184 px**, restrictions **228 px**.
- Bottom spacing is dynamic: `24px + --system-safe-bottom`; no fake Home Indicator. The screen has no 360 px side-padding fallback — it remains 20 px as authored.
- Group headings are Martian Grotesk 16/20 medium.
- Tables reuse `Block` + internal `DetailRow`, with values in secondary text.

## Current specification content

- `/сетевые данные`: location, Shared IPv4, IPv6, Shared NAT, Post forwarding, BittDNS leak protection.
- `/протокол`: Wireguard, AmneziaWG, OpenVPN, MTU.
- `/ограничения`: connections, P2P, traffic, speed, MTU.
- Location/city are populated from the currently selected country; the remaining rows follow the current Figma specification.

## Documentation update rule

Update this file whenever the screen layout, rows, navigation behavior or Figma source changes.
