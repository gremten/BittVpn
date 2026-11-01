# Golos UI — local variable font

The app uses the project's own **Golos UI Variable** webfont instead of a runtime/CDN font or `@fontsource`.

## One-time setup

Place the original `Golos_UI_Complete_Family.zip` in the project root and run:

```bash
npm run font:install
```

Or pass the ZIP explicitly:

```bash
npm run font:install -- "/path/to/Golos_UI_Complete_Family.zip"
```

The installer extracts only:

`Fonts/Golos UI_VF/Golos UI_VF/Golos UI_VF.woff2`

into:

`src/fonts/GolosUI-VF.woff2`

The extraction code is pure Node.js and does not require `unzip`, PowerShell, or another npm package.

## Production

`prestart` and `prebuild` verify that the local WOFF2 is present and valid. Once generated, commit `src/fonts/GolosUI-VF.woff2` to the real project repository so production builds are fully self-contained.

The CSS registers the whole supported design range:

```css
font-family: "Golos UI";
font-weight: 400 700;
```

so `400`, `500`, `600`, `700`, and intermediate variable weights work without changing the font setup.
