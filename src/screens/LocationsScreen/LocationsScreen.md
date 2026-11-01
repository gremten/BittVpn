# LocationsScreen

**Source:** `src/screens/LocationsScreen/LocationsScreen.js`

## Purpose

Root Navigator destination that collects every currently purchased location and every currently available-to-buy location in one screen.

## Figma source

- Purchased tab: `7435:36711` — `t-locations | purchased`.
- Available tab: `7435:37052` — `t-locations | available`.
- Tabs component set: `7435:37032`; active master `7435:37022`.
- Figma navigation instance with Locations selected: `7435:36728`; production reuses shared `NavigatorDock` / `Navigator` instead of cloning that instance locally.

## Layout

- Product content uses the established root-screen safe-area convention: 20 px horizontal insets and `16px + app-safe-top` above content.
- Tabs are 32 px high; location cards begin 16 px below the tab row.
- Card stack gap is 8 px.
- Purchased cards are 68 px high; available cards are 100 px high.
- Screen-owned bottom reserve uses the same existing Navigator formula as Main/Profile. Do not couple this padding to AppTabBar internals.

## Data / states

- Purchased tab reads `PURCHASED_LOCATION_IDS` / `LOCATIONS` and the App-owned live `deviceCounts`.
- Germany/Lithuania/Kazakhstan keep the same current/maintenance/limit card semantics as Main.
- Available tab reads `AVAILABLE_LOCATION_IDS` / `LOCATIONS` and appends the current Figma disabled Spain card (`Испания`, `Временно недоступна`, `На паузе`, `Стриминг`, `Игры`).
- All enabled cards reuse shared `LocationCard` and open the existing single `CountryScreen` for that location; no parallel location detail routes are introduced.

## Navigation

- Locations is a **root** common-Navigator destination (`configurations`). Entering it from Main/Profile replaces the root stack, so Telegram BackButton stays hidden.
- Tapping a location pushes `CountryScreen`; Telegram Back returns Country → Locations.
- Selected inner tab is owned by App so opening a Country from `Доступные` and returning does not reset the page to `Купленные`.
- Tapping the already-selected Locations item in the common Navigator scrolls this screen to top.

## Props

| Prop | Ownership |
| --- | --- |
| `selectedTab` | App-controlled `purchased | available`. |
| `onSelectTab` | App callback; changes the inner tab without changing root navigation. |
| `deviceCounts` | App-owned live purchased-device counters. |
| `onOpenCountry` | App navigation into the existing Country screen. |
| `onOpenMain` | Root Navigator switch to Main. |
| `onOpenProfile` | Root Navigator switch to Profile. |

## Invariants

- Do not create a local copy of Navigator, LocationCard, or Tabs styling inside this screen.
- Do not add a page-local wrapper/surface around the shared navigation pill.
- Do not add screen-specific safe-area formulas to TabBar/BottomSheet to make this page fit; this screen owns only its content reserve.

## Documentation update rule

If the screen changes in layout, data, tabs, navigation, Figma states, or card behavior, update this file in the same change.
