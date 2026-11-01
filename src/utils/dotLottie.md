# dotLottie

**Source:** `src/utils/dotLottie.js`

## Purpose

Small local loader for the project's `.lottie` animation containers.

## Why this exists

- The Sakura source `.lottie` is only about **18 KB**, while the equivalent unpacked JSON is about **477 KB**.
- We deliberately do **not** add the official dotLottie web player just to read this file: the app already has `lottie-web`, and introducing a second player/runtime would add unnecessary startup/runtime cost.
- The utility reads the ZIP central directory, extracts `manifest.json` and the selected animation JSON, and uses the browser-native `DecompressionStream('deflate-raw')` for deflated entries.
- No external CDN/runtime URL is required.

## Contract

- Input is a local `.lottie` asset URL.
- Returns parsed Lottie animation data.
- Successful parsed animation data is **page-session cached by URL**, so remounting Sakura does not refetch or re-inflate the same `.lottie` archive. Failed attempts are removed from the cache and may retry later.
- Supports stored ZIP entries (`method 0`) and deflated entries (`method 8`), which covers the current asset.
- If the browser does not support the required decompression API or the archive is malformed, the caller must fail open to its decorative poster rather than blocking the app.

## Current consumer

- `SakuraAnimation` uses `sakura_falling_vector.lottie`.
- The old unpacked `sakura_falling_vector.json` was removed from the project after byte-for-byte/parsed-equivalence verification. The `.lottie` container is now the single canonical Sakura animation payload.
