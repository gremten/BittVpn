# Characteristics

**Source:** `src/features/country/Characteristics.js`

## Purpose

Compact country technical-characteristics preview on Country.

## Figma source

- Current compact block is visible in `7166:122710` / `7171:123296`.
- Full details destination: `7172:124235`.

## Props / API

| Prop | Contract |
| --- | --- |
| `countryName` | current location country |
| `city` | current location city |
| `onOpenSpecifications` | opens the nested full specifications screen |

## Interaction

- The `Все` xsmall outlined button opens full specifications.
- The entire characteristics `Block` opens the same destination and is keyboard activatable with Enter/Space.
- Do not add a local scale-on-hold animation to the Block; it keeps standard Block visuals.

## Content

- Compact preview stays `Локация / Протоколы / Трафик / Скорость / Подключение / Доп. устройство`.
- Extra-device price is read from shared `EXTRA_DEVICE_PRICE`, never duplicated as a literal.

## Documentation update rule

Update this file whenever preview content, interaction or destination changes.
