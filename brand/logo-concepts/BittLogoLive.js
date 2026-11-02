import React, { useId, useMemo, useState } from 'react';

/*
 * BittLogoLive — variant 5 "Interactive Live Systole".
 * Static: the grid-aligned ECG-B (same geometry as bitt-logo-v1-grid.svg).
 * Animated: a bright pulse runs along the trace (P → QRS stem → bowls → exit) and every white
 * node flares as the pulse reaches it, then settles back. One beat = BEAT_MS, then a short rest.
 * Self-contained: no external styles, tokens or fonts. Colours come from the dot-matrix reference.
 */

const GRID_SIZE = 11;
const STEP = 20;
const PAD = 20;
const VIEW = PAD * 2 + STEP * (GRID_SIZE - 1);

const COLOR_BACKGROUND = '#000000';
const COLOR_GRID = '#3A3A3A';
const COLOR_ACTIVE = '#FFFFFF';

const GRID_DOT_RADIUS = 6;
const NODE_RADIUS = 6.5;
const LINE_WIDTH = 2.5;
const TRACE_WIDTH = 4;

const BEAT_MS = 1600;
const SWEEP_SHARE = 0.55; // part of the beat the pulse needs to travel the whole trace
const TRACE_DASH = 0.14;  // visible pulse length as a share of the whole trace

// Trace in drawing order, in grid units (col, row).
const TRACE = [
  [[0, 5], [1, 5], [2, 6], [3, 1], [3, 9]],
  [[3, 1], [6, 1], [7, 2], [7, 3], [6, 4], [5, 5], [3, 5]],
  [[5, 5], [7, 5], [8, 6], [8, 8], [7, 9], [3, 9]],
  [[7, 5], [10, 5]],
];

const toPx = (unit) => PAD + STEP * unit;

function gcd(a, b) {
  return b ? gcd(b, a % b) : Math.abs(a);
}

// Every grid point the trace passes through, with its distance along the trace (first visit wins).
function buildNodes() {
  const nodes = new Map();
  let travelled = 0;
  TRACE.forEach((line) => {
    for (let i = 0; i < line.length - 1; i += 1) {
      const [c1, r1] = line[i];
      const [c2, r2] = line[i + 1];
      const dc = c2 - c1;
      const dr = r2 - r1;
      const length = Math.hypot(dc, dr);
      const steps = gcd(Math.abs(dc), Math.abs(dr)) || 1;
      for (let s = 0; s <= steps; s += 1) {
        const c = c1 + (dc / steps) * s;
        const r = r1 + (dr / steps) * s;
        const key = `${c},${r}`;
        if (!nodes.has(key)) nodes.set(key, { c, r, distance: travelled + (length / steps) * s });
      }
      travelled += length;
    }
  });
  return { nodes: [...nodes.values()], total: travelled };
}

function buildPathData() {
  return TRACE.map((line) => line
    .map(([c, r], index) => `${index === 0 ? 'M' : 'L'}${toPx(c)} ${toPx(r)}`)
    .join(' ')).join(' ');
}

function buildStyles(prefix) {
  return `
.${prefix}-trace { stroke-dasharray: ${TRACE_DASH} 2; stroke-dashoffset: ${TRACE_DASH}; opacity: 0; }
.${prefix}-node { transform-box: fill-box; transform-origin: center; }
.${prefix}-is-live .${prefix}-line { opacity: 0.35; transition: opacity 240ms ease; }
.${prefix}-is-live .${prefix}-trace { opacity: 1; animation: ${prefix}-sweep ${BEAT_MS}ms linear infinite; }
.${prefix}-is-live .${prefix}-node { animation: ${prefix}-flare ${BEAT_MS}ms ease-out infinite; }
@keyframes ${prefix}-sweep {
  0% { stroke-dashoffset: ${TRACE_DASH}; }
  ${Math.round(SWEEP_SHARE * 100)}% { stroke-dashoffset: -1; }
  100% { stroke-dashoffset: -1; }
}
@keyframes ${prefix}-flare {
  0% { opacity: 0.35; transform: scale(1); }
  4% { opacity: 1; transform: scale(1.3); }
  16% { opacity: 1; transform: scale(1); }
  45% { opacity: 0.35; transform: scale(1); }
  100% { opacity: 0.35; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .${prefix}-is-live .${prefix}-line { opacity: 1; }
  .${prefix}-is-live .${prefix}-trace { animation: none; opacity: 0; }
  .${prefix}-is-live .${prefix}-node { animation: none; opacity: 1; }
}
`;
}

/**
 * @param {object} props
 * @param {number} [props.size=240] rendered width/height in px
 * @param {'loop'|'hover'|'static'} [props.mode='hover'] when the pulse runs
 * @param {string} [props.title='BittVPN'] accessible name
 * @param {string} [props.className]
 */
export default function BittLogoLive({ size = 240, mode = 'hover', title = 'BittVPN', className }) {
  const reactId = useId();
  const prefix = `bitt-live-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [isHovered, setIsHovered] = useState(false);

  const { nodes, total } = useMemo(buildNodes, []);
  const pathData = useMemo(buildPathData, []);
  const styles = useMemo(() => buildStyles(prefix), [prefix]);

  const activeKeys = useMemo(() => new Set(nodes.map((node) => `${node.c},${node.r}`)), [nodes]);
  const gridDots = useMemo(() => {
    const dots = [];
    for (let r = 0; r < GRID_SIZE; r += 1) {
      for (let c = 0; c < GRID_SIZE; c += 1) {
        if (!activeKeys.has(`${c},${r}`)) dots.push({ c, r });
      }
    }
    return dots;
  }, [activeKeys]);

  const isLive = mode === 'loop' || (mode === 'hover' && isHovered);
  const interactive = mode === 'hover';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={[className, isLive ? `${prefix}-is-live` : ''].filter(Boolean).join(' ')}
      onMouseEnter={interactive ? () => setIsHovered(true) : undefined}
      onMouseLeave={interactive ? () => setIsHovered(false) : undefined}
      onFocus={interactive ? () => setIsHovered(true) : undefined}
      onBlur={interactive ? () => setIsHovered(false) : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <title>{title}</title>
      <style>{styles}</style>
      <rect width={VIEW} height={VIEW} fill={COLOR_BACKGROUND} />
      <g fill={COLOR_GRID}>
        {gridDots.map(({ c, r }) => (
          <circle key={`g-${c}-${r}`} cx={toPx(c)} cy={toPx(r)} r={GRID_DOT_RADIUS} />
        ))}
      </g>
      <path
        className={`${prefix}-line`}
        d={pathData}
        fill="none"
        stroke={COLOR_ACTIVE}
        strokeWidth={LINE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={`${prefix}-trace`}
        d={pathData}
        pathLength={1}
        fill="none"
        stroke={COLOR_ACTIVE}
        strokeWidth={TRACE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill={COLOR_ACTIVE}>
        {nodes.map(({ c, r, distance }) => (
          <circle
            key={`n-${c}-${r}`}
            className={`${prefix}-node`}
            cx={toPx(c)}
            cy={toPx(r)}
            r={NODE_RADIUS}
            style={isLive ? { animationDelay: `${Math.round((distance / total) * SWEEP_SHARE * BEAT_MS)}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
