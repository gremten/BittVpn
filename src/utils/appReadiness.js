const APP_FONT_SPECS = Object.freeze([
  '400 16px "Golos UI"',
  '500 16px "Martian Grotesk"',
  '400 24px "Nothing Font"',
]);

export const APP_FONT_READY_TIMEOUT_MS = 1200;

let fontsReadyPromise = null;

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function waitForAppFonts() {
  if (fontsReadyPromise) return fontsReadyPromise;

  if (typeof document === 'undefined' || !document.fonts?.load) {
    fontsReadyPromise = Promise.resolve();
    return fontsReadyPromise;
  }

  const actualReadiness = Promise.allSettled(
    APP_FONT_SPECS.map((spec) => document.fonts.load(spec))
  )
    .then(() => document.fonts.ready)
    .then(() => undefined);

  // A buggy mobile WebView must not make the app unusable forever. In the
  // ordinary path the fonts finish first and the skeleton still behaves as
  // designed; this timeout is only a recovery ceiling.
  fontsReadyPromise = Promise.race([
    actualReadiness,
    delay(APP_FONT_READY_TIMEOUT_MS),
  ]).then(() => undefined);

  return fontsReadyPromise;
}
