# IntroScreen

First screen for every document launch. Skip replaces it with Main; “Начать путешествие” opens the existing Locations root on its available tab. Root navigation and native back remain owned by App.

The local decorative canvas renderer is isolated in `public/intro/planet.html` from the approved prototype; its text and buttons are hidden while their geometry remains for globe fitting. Its iframe is destroyed on exit, including its animation and handlers. The accessible title and controls are React UI. Controls remain reachable if the renderer fails, and reduced-motion shows the final frame. A same-origin message synchronizes the copy with the renderer. The skip Button removes its horizontal padding and the label's own padding. The action uses the shared ghost AppTabBar and its normal safe-area clearance.

Assets are local. Keep the renderer and React copy, fitting geometry, timing and safe areas in sync when changing the prototype.
