const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT, 'src/assets/icons/morph-source');
const OUT = path.join(ROOT, 'src/components/ui/internal/dotMorphIcons.js');

const DOT_RADIUS = 1.56055;
const DOT_DIAMETER = DOT_RADIUS * 2;
const DOT_STEP = 4.6836;
const DASH_EPSILON = 0.001;
const DASH_GAP = DOT_STEP - DASH_EPSILON;

function extractCenters(svg) {
  const points = [];
  const pattern = /M([0-9.]+) ([0-9.]+)C/g;
  let match;
  while ((match = pattern.exec(svg))) {
    points.push([Number(match[1]), Number(match[2]) + DOT_RADIUS]);
  }
  return points;
}

function cluster(values, tolerance = 0.01) {
  const groups = [];
  [...values].sort((a, b) => a - b).forEach((value) => {
    const group = groups[groups.length - 1];
    if (!group) {
      groups.push([value]);
      return;
    }
    const average = group.reduce((sum, item) => sum + item, 0) / group.length;
    if (Math.abs(average - value) < tolerance) group.push(value);
    else groups.push([value]);
  });
  return groups.map((group) => group.reduce((sum, item) => sum + item, 0) / group.length);
}

function nearestIndex(values, value) {
  let best = 0;
  let distance = Infinity;
  values.forEach((candidate, index) => {
    const nextDistance = Math.abs(candidate - value);
    if (nextDistance < distance) {
      best = index;
      distance = nextDistance;
    }
  });
  return best;
}

function consecutiveRuns(values) {
  if (!values.length) return [];
  const runs = [];
  let start = values[0];
  let previous = values[0];
  values.slice(1).forEach((value) => {
    if (value === previous + 1) previous = value;
    else {
      runs.push([start, previous]);
      start = previous = value;
    }
  });
  runs.push([start, previous]);
  return runs;
}

function buildSegments(svg) {
  const points = extractCenters(svg);
  const xs = cluster(points.map(([x]) => x));
  const ys = cluster(points.map(([, y]) => y));
  const remaining = new Set(
    points.map(([x, y]) => `${nearestIndex(xs, x)},${nearestIndex(ys, y)}`)
  );
  const segments = [];

  ys.forEach((y, yi) => {
    const row = [...remaining]
      .map((key) => key.split(',').map(Number))
      .filter(([, cellY]) => cellY === yi)
      .map(([cellX]) => cellX)
      .sort((a, b) => a - b);

    consecutiveRuns(row).forEach(([start, end]) => {
      if (end - start + 1 < 2) return;
      segments.push([xs[start], y, xs[end], y]);
      for (let xi = start; xi <= end; xi += 1) remaining.delete(`${xi},${yi}`);
    });
  });

  xs.forEach((x, xi) => {
    const col = [...remaining]
      .map((key) => key.split(',').map(Number))
      .filter(([cellX]) => cellX === xi)
      .map(([, cellY]) => cellY)
      .sort((a, b) => a - b);

    consecutiveRuns(col).forEach(([start, end]) => {
      if (end - start + 1 < 2) return;
      segments.push([x, ys[start], x, ys[end]]);
      for (let yi = start; yi <= end; yi += 1) remaining.delete(`${xi},${yi}`);
    });
  });

  [...remaining]
    .map((key) => key.split(',').map(Number))
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
    .forEach(([xi, yi]) => {
      const x = xs[xi];
      const y = ys[yi];
      segments.push([x, y, x + DASH_EPSILON, y]);
    });

  return segments;
}

function toPath(segments) {
  return segments
    .map(([x1, y1, x2, y2]) =>
      `M${x1.toFixed(5)} ${y1.toFixed(5)} L${x2.toFixed(5)} ${y2.toFixed(5)}`
    )
    .join(' ');
}

const icons = {
  trash: toPath(buildSegments(fs.readFileSync(path.join(SOURCE_DIR, 'icn_el_trash.svg'), 'utf8'))),
  check: toPath(buildSegments(fs.readFileSync(path.join(SOURCE_DIR, 'icn_el_check.svg'), 'utf8'))),
};

const output = `// Generated from exact product dot-matrix SVGs in src/assets/icons/morph-source.
// Do not hand-edit paths. Regenerate with scripts/generate-dot-morph-icons.cjs.

export const DOT_MORPH_VIEWBOX = '0 0 64 64';
export const DOT_MORPH_STROKE_WIDTH = ${DOT_DIAMETER.toFixed(5)};
export const DOT_MORPH_DASH_ARRAY = '${DASH_EPSILON.toFixed(3)} ${DASH_GAP.toFixed(5)}';

export const DOT_MORPH_ICONS = Object.freeze(${JSON.stringify(icons, null, 2)});
`;

fs.writeFileSync(OUT, output);
console.log(`Generated ${OUT}`);
