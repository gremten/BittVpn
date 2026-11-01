/*
 * Installs Golos UI Variable WOFF2 from the original complete-family ZIP.
 * No npm package or external ZIP utility is required.
 *
 * Usage:
 *   npm run font:install
 *   npm run font:install -- "C:\\path\\Golos_UI_Complete_Family.zip"
 *   GOLOS_UI_ZIP=/path/to/Golos_UI_Complete_Family.zip npm run font:install
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'src', 'fonts', 'GolosUI-VF.woff2');
const expectedEntry = 'Fonts/Golos UI_VF/Golos UI_VF/Golos UI_VF.woff2';
const sourceZipName = 'Golos_UI_Complete_Family.zip';

function fail(message) {
  console.error(`\n[golos-ui] ${message}\n`);
  process.exit(1);
}

function findZip() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--install');
  const candidates = [
    args[0],
    process.env.GOLOS_UI_ZIP,
    path.join(projectRoot, sourceZipName),
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(path.resolve(candidate))) || null;
}

function readUInt32LE(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function readUInt16LE(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function extractEntry(zipPath, entryName) {
  const data = fs.readFileSync(zipPath);
  const eocdSignature = 0x06054b50;
  const centralSignature = 0x02014b50;
  const localSignature = 0x04034b50;

  // EOCD can be at most 65,557 bytes from EOF (22-byte record + max comment).
  const searchStart = Math.max(0, data.length - 65557);
  let eocdOffset = -1;
  for (let i = data.length - 22; i >= searchStart; i -= 1) {
    if (readUInt32LE(data, i) === eocdSignature) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error('ZIP end-of-central-directory record not found');

  const centralOffset = readUInt32LE(data, eocdOffset + 16);
  const totalEntries = readUInt16LE(data, eocdOffset + 10);
  let cursor = centralOffset;

  for (let index = 0; index < totalEntries; index += 1) {
    if (readUInt32LE(data, cursor) !== centralSignature) {
      throw new Error('Invalid ZIP central directory');
    }

    const method = readUInt16LE(data, cursor + 10);
    const compressedSize = readUInt32LE(data, cursor + 20);
    const uncompressedSize = readUInt32LE(data, cursor + 24);
    const fileNameLength = readUInt16LE(data, cursor + 28);
    const extraLength = readUInt16LE(data, cursor + 30);
    const commentLength = readUInt16LE(data, cursor + 32);
    const localOffset = readUInt32LE(data, cursor + 42);
    const name = data.subarray(cursor + 46, cursor + 46 + fileNameLength).toString('utf8');

    if (name === entryName) {
      if (readUInt32LE(data, localOffset) !== localSignature) {
        throw new Error('Invalid ZIP local header');
      }
      const localNameLength = readUInt16LE(data, localOffset + 26);
      const localExtraLength = readUInt16LE(data, localOffset + 28);
      const payloadOffset = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = data.subarray(payloadOffset, payloadOffset + compressedSize);

      let output;
      if (method === 0) output = Buffer.from(compressed);
      else if (method === 8) output = zlib.inflateRawSync(compressed);
      else throw new Error(`Unsupported ZIP compression method: ${method}`);

      if (output.length !== uncompressedSize) {
        throw new Error(`Unexpected extracted size: ${output.length} != ${uncompressedSize}`);
      }
      return output;
    }

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`Font entry not found: ${entryName}`);
}

function validateWoff2(buffer) {
  if (buffer.length < 4 || buffer.subarray(0, 4).toString('ascii') !== 'wOF2') {
    throw new Error('Extracted file is not a valid WOFF2 font');
  }
}

if (fs.existsSync(outputPath)) {
  const existing = fs.readFileSync(outputPath);
  try {
    validateWoff2(existing);
    console.log('[golos-ui] Local variable font is ready.');
    process.exit(0);
  } catch {
    console.warn('[golos-ui] Existing GolosUI-VF.woff2 is invalid; reinstalling.');
  }
}

const zipPath = findZip();
if (!zipPath) {
  fail(
    `GolosUI-VF.woff2 is missing. Put ${sourceZipName} in the project root ` +
      'or run: npm run font:install -- <path-to-zip>'
  );
}

try {
  const font = extractEntry(path.resolve(zipPath), expectedEntry);
  validateWoff2(font);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, font);
  console.log(`[golos-ui] Installed variable font: ${path.relative(projectRoot, outputPath)} (${font.length} bytes)`);
} catch (error) {
  fail(`Could not install Golos UI: ${error.message}`);
}
