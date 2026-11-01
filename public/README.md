# BitVPN Mini App prototype

CRA-based Telegram Mini App prototype. The code mirrors the reusable component families from the Figma userflow page and keeps screen-specific behavior out of `App.js`.

## Run

```bash
npm install
npm start
```

`lottie-web` is a declared dependency and is used only for the local Sakura animation. The animation itself is stored locally in `src/assets/animations`; there are no runtime Figma/CDN dependencies.

## Architecture

```text
src/
├── App.js                   # root navigation only
├── index.js                 # React entrypoint + global CSS
├── telegram.js              # Telegram WebApp integration
├── config/                  # shared product constants
├── screens/                 # screen composition/state
│   ├── MainScreen/
│   ├── CountryScreen/
│   └── CheckoutScreen/
├── features/                # reusable flow-specific pieces
│   ├── country/
│   ├── purchase/
│   └── checkout/
├── components/
│   ├── ui/                  # public Figma component families, one file each
│   ├── overlays/            # content-agnostic BottomSheet shell
│   ├── media/               # Sakura Lottie wrapper
│   └── layout/              # AppShell
├── styles/
│   ├── tokens.css
│   └── globals.css
└── assets/
```

### Screen flow

`t-main → country → subscription bottom sheet → checkout`

All location cards on `t-main` open the current country-detail prototype. The checkout receives the duration selected in the bottom sheet.

### Sakura geometry

The Figma promo art wrapper is kept at `148 × 170`, anchored at `right: -16px` and vertically centered. The supplied Lottie has an intrinsic canvas of `148 × 171`, so it is rendered 1:1 and clipped by the one-pixel-shorter Figma wrapper rather than scaled responsively.

### Slot-catch navigator interaction

The main `Navigator` uses Motion shared-layout animation. On hold/drag it collapses to four contiguous 56px slots; the active white pill is attached to the caught slot and swaps to that slot's filled icon. On release the selected slot and the navigator expand back to the exact Figma HUG geometry and the text label returns.

## Telegram share action

The referral card uses Telegram's native chat chooser through `Telegram.WebApp.openTelegramLink()` and the official `https://t.me/share/url?url=...&text=...` share link.

- message: `Приглашаю тебя посетить мой ускоритель интернета`
- URL: `REACT_APP_TELEGRAM_APP_URL` when configured; otherwise the clean current app URL (without Telegram launch query/hash)
- the adjacent copy button copies the same URL
