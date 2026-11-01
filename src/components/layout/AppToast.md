# AppToast

**Source:** `src/components/layout/AppToast.js`

## Purpose

Global transient acknowledgement **stack**. Toasts stay outside screen navigation state. Each toast can expire normally or the front toast can be dismissed by an upward swipe.

## Figma source

- File: `5ks9FYkDbV4fcg60G4SLjf`
- Working page: `🛠️ Userflow и прототипирование`
- Toast instance: `7016:116997`, 362×52 at x=20 / y=118 in the 402px reference frame.
- Success icon: `7016:117193` — `icn_m_circle-success-filled`, 24×24.
- The success icon is stored locally at `src/assets/icons/nav/icn_m_circle-success-filled.svg`; do not replace it with a CSS circle/check approximation.
- The success icon is imported as an **inline React SVG component**, not rendered through `<img>`. It must be present from the first animation frame and transform/fade with the toast layer itself; do not reintroduce interaction-time image loading/decoding for this icon.
- Re-verified against current Figma toast node `7016:116997`: keep the exact local 24×24 success glyph inline; no runtime Figma/MCP URL and no `<img>` indirection. SVG geometry was normalized/fingerprint-checked against the current Figma export.

## Motion reference

The stack/enter/exit motion follows the supplied video `97cd8c23-df99-4f34-a44b-d26e684ee8e8.mp4` and uses one reversible reveal path:

- fixed visible anchor is unchanged; the toast opens from a hidden pose **40 px above** the anchor, `scale: 0.96`, `opacity: 0`. The extra travel intentionally begins underneath Telegram's reserved native Close/Back row, so the toast is already partially visible by the time it clears that row instead of appearing abruptly;
- opening reaches the visible pose (`y: 0`, `scale: 1`, `opacity: 1`) in **220 ms** with easing `[0.16, 1, 0.3, 1]`;
- automatic closing is the **exact spatial reverse** of opening: it returns to the same hidden pose and uses the mathematically reversed cubic `[0.7, 0, 0.84, 0]` over the same 220 ms;
- the previous toast still recedes behind a newer toast: 8 px upward per visible depth level and 4% scale reduction per level;
- up to 4 levels are rendered (front + 3 receded layers); deeper layers remain mounted but visually hidden;
- stack position/scale changes remain spring-based; this stack rearrangement is separate from the reversible open/close path;
- `prefers-reduced-motion` removes decorative entrance/stack/exit motion without changing state behavior.

## Props / API

| Prop | Default / ownership |
| --- | --- |
| `toasts` | array of `{ id, message }`, owned by `App` |
| `onDismiss(id, reason)` | called after a completed manual swipe |
| `onInteractionChange(id, active)` | lets `App` pause/resume that toast's 5-second lifetime during a controlled drag |

## Lifetime and gesture contract

- `App` owns a separate **5000 ms lifetime per toast**. New notifications do not replace or restart older notifications; they stack.
- Only the front toast accepts pointer interaction; receded stack layers are visual only.
- Pointer Events + pointer capture are used so the front toast follows the finger continuously even if the pointer leaves its bounds.
- Manual dismissal **scrubs the same close path instead of using a separate swipe animation**. While the finger moves upward, `y` follows the pointer 1:1; `scale` and `opacity` are derived from that live displacement along the same `0 → -40 px / 1 → 0.96 / 1 → 0` reveal path.
- At 40 px upward displacement the visual close path is fully scrubbed (`scale: 0.96`, `opacity: 0`). If the finger travels farther, position may continue following the finger while scale/opacity stay at the fully closed values.
- Releasing after **50% of the close path (20 px upward)** commits dismissal. The toast completes only the **remaining fraction** of the reverse-close path; remaining duration is proportional to unscrubbed progress (`220 ms × remaining progress`) and uses the same reverse-close easing, then `onDismiss(id, 'swipe')` is called.
- Releasing before the 50% threshold (or receiving `pointercancel`) runs only the remaining fraction of the **opening path back to rest** (`220 ms × scrubbed progress`), so the manual interaction reverses cleanly rather than snapping or switching to another animation.
- The lifetime remains paused for the full drag + return-to-rest gesture and resumes only after the toast has visually returned. A committed close never resumes the lifetime.
- Swipe interaction must never mutate application screen/navigation state.
- Icon and label are not animated independently. Both remain children of the same Motion layer, so entrance, exit, stack movement and manual swipe scrubbing apply to the complete toast as one visual object.

## Styling

- Global stack/toast styles live in `src/styles/globals.css`.
- The stack anchor preserves the Figma x/y geometry through the existing safe-area variables.
- The 40 px hidden offset is deliberate: the visible anchor sits 20 px below `--app-safe-top`, while Telegram fullscreen reserves a native control row above it. Enter/exit therefore fade through that reserved area and remain exact reverses of each other.
- The translucent toast surface keeps the Figma-style **6 px backdrop blur**. The border/background/blur now live directly on `.app-toast-layer` (the Motion element), not on a transformed descendant, so the real page remains the sampled backdrop during enter/stack/exit motion and while swiping.
- Toasts have **no box shadow**; the previous Figma shadow token is intentionally disabled.
- `touch-action: none` is scoped to the toast surface only.

## Before changing this

1. Read `/AGENTS.md`.
2. Read this file and the source `src/components/layout/AppToast.js`.
3. If the visual or interaction behavior comes from Figma, inspect the exact current node before changing it.
4. Preserve existing public props/interactions unless the task explicitly changes them.

## Documentation update rule

If `AppToast.js` changes in layout, behavior, props, states, assets, timing, Figma node, navigation role, stack rules, or known constraints, update **this Markdown file in the same change**. If the change affects a parent screen/flow, update that screen Markdown too.
