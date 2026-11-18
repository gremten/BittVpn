# IntroScreen

First screen for every document launch. Skip replaces it with Main; “Начать путешествие” opens the existing Locations root on its available tab. Root navigation and native back remain owned by App.

The local decorative canvas renderer is isolated in `public/intro/planet.html` from the approved prototype; its text and buttons are hidden while their geometry remains for globe fitting. Its iframe is destroyed on exit, including its animation and handlers. The accessible title and controls are React UI. Controls remain reachable if the renderer fails, and reduced-motion shows the final frame. A same-origin message synchronizes the copy with the renderer. The skip Button removes its horizontal padding and the label's own padding. The action uses the shared ghost AppTabBar and its normal safe-area clearance.

Assets are local. Keep the renderer and React copy, fitting geometry, timing and safe areas in sync when changing the prototype.

## Goals stage («Для чего тебе нужен ВПН?»)

«Начать путешествие» no longer opens Locations at once. If the renderer has loaded, it posts `bitt-intro-goals-start` to the iframe and the React copy/controls fade out (380 ms, `intro-screen--goals`); `public/intro/planet.html` then plays the goals stage (planet rolls right to left, the camera flies in to ten planet dots, the rest of the planet fades in waves, the dots become chips; title, 3–4 goal chips multi-select (max 4), button «Выбери хотя бы одну цель» → «Подобрать» when 3–4 are selected). The chips, title and button of the stage are drawn inside the iframe (canvas-synchronised animation), not by React. «Подобрать» posts `bitt-intro-goals-submit` and the screen calls `onContinue()` (Locations, as «Начать путешествие» did); goals are not stored. If the renderer did not load, «Начать путешествие» behaves as before.

Messages (same origin only, source checked on both sides): iframe → app `bitt-intro-ready`, `bitt-intro-goals-submit` (`goals`: selected labels); app → iframe `bitt-intro-goals-start`, `bitt-intro-insets` (`top`: `--app-safe-top` in px, for the stage title). While the stage is shown the iframe becomes accessible (`aria-hidden` removed, `title` set). `prefers-reduced-motion`: the renderer shows the welcome frame first and switches to the final goals frame without animation after «Начать путешествие».

Source of truth for the stage (timeline, curves, values): `research/intro_animation_timeline.md` §0а and `prototypes/intro-animation/` in the `design` branch; `public/intro/planet.html` = that prototype with external fonts (`assets/`) and the renderer's own welcome text/buttons hidden. Keep both in sync.
