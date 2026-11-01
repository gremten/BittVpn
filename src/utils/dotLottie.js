const ZIP_EOCD_SIGNATURE = 0x06054b50;
const ZIP_CENTRAL_SIGNATURE = 0x02014b50;
const ZIP_LOCAL_SIGNATURE = 0x04034b50;

const animationDataPromiseByUrl = new Map();

function findEndOfCentralDirectory(view) {
  // EOCD is at least 22 bytes and ZIP comments are max 65535 bytes.
  const minOffset = Math.max(0, view.byteLength - 22 - 0xffff);
  for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
    if (view.getUint32(offset, true) === ZIP_EOCD_SIGNATURE) return offset;
  }
  throw new Error('dotLottie: ZIP end-of-central-directory not found');
}

function readEntries(buffer) {
  const view = new DataView(buffer);
  const decoder = new TextDecoder();
  const eocdOffset = findEndOfCentralDirectory(view);
  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const centralOffset = view.getUint32(eocdOffset + 16, true);

  const entries = new Map();
  let offset = centralOffset;

  for (let index = 0; index < totalEntries; index += 1) {
    if (view.getUint32(offset, true) !== ZIP_CENTRAL_SIGNATURE) {
      throw new Error('dotLottie: invalid central-directory entry');
    }

    const compressionMethod = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    const fileNameBytes = new Uint8Array(buffer, offset + 46, fileNameLength);
    const fileName = decoder.decode(fileNameBytes);

    entries.set(fileName, {
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

async function extractEntry(buffer, entry) {
  const view = new DataView(buffer);
  const offset = entry.localHeaderOffset;

  if (view.getUint32(offset, true) !== ZIP_LOCAL_SIGNATURE) {
    throw new Error('dotLottie: invalid local file header');
  }

  const fileNameLength = view.getUint16(offset + 26, true);
  const extraLength = view.getUint16(offset + 28, true);
  const dataOffset = offset + 30 + fileNameLength + extraLength;
  const compressed = new Uint8Array(buffer, dataOffset, entry.compressedSize);

  if (entry.compressionMethod === 0) {
    return compressed.slice();
  }

  if (entry.compressionMethod !== 8) {
    throw new Error(`dotLottie: unsupported ZIP compression method ${entry.compressionMethod}`);
  }

  if (typeof DecompressionStream !== 'function') {
    throw new Error('dotLottie: DecompressionStream is unavailable');
  }

  const stream = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'));

  const output = new Uint8Array(await new Response(stream).arrayBuffer());

  if (entry.uncompressedSize && output.byteLength !== entry.uncompressedSize) {
    throw new Error('dotLottie: extracted size mismatch');
  }

  return output;
}

async function extractJson(buffer, entries, name) {
  const entry = entries.get(name);
  if (!entry) throw new Error(`dotLottie: missing ${name}`);

  const bytes = await extractEntry(buffer, entry);
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function loadDotLottieAnimationData(url) {
  const cached = animationDataPromiseByUrl.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`dotLottie: failed to load ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const entries = readEntries(buffer);
    const manifest = await extractJson(buffer, entries, 'manifest.json');
    const animationId = manifest?.initial?.animation || manifest?.animations?.[0]?.id;

    if (!animationId) {
      throw new Error('dotLottie: manifest has no animation id');
    }

    const preferredPath = `a/${animationId}.json`;
    const animationPath = entries.has(preferredPath)
      ? preferredPath
      : [...entries.keys()].find((name) => name.endsWith(`/${animationId}.json`) || name === `${animationId}.json`);

    if (!animationPath) {
      throw new Error(`dotLottie: animation ${animationId} not found`);
    }

    return extractJson(buffer, entries, animationPath);
  })();

  animationDataPromiseByUrl.set(url, promise);

  // Failed attempts may be retried later; successful parsed data remains
  // page-session cached and is reused across every Main remount.
  promise.catch(() => {
    if (animationDataPromiseByUrl.get(url) === promise) {
      animationDataPromiseByUrl.delete(url);
    }
  });

  return promise;
}
