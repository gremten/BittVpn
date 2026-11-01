import { motion, useReducedMotion } from 'motion/react';
import { ReactComponent as ExactCheckIcon } from '../../assets/icons/morph-source/icn_el_check.svg';
import {
  DOT_MORPH_SEGMENTS,
  DOT_MORPH_SEGMENT_STROKE_WIDTH,
  DOT_MORPH_SEGMENT_VIEWBOX,
} from './internal/dotMorphSegments';

const DOTTED = '0.001 4.68260';
const SOLID = '64 0';
const MORPH_DURATION_SECONDS = 0.45;
const MORPH_TIMES = [0, 0.22, 0.76, 1];

export function preloadDotMorphIconEngine() {
  return Promise.resolve();
}

function trashToCheckLine(index) {
  const [sx1, sy1, sx2, sy2] = DOT_MORPH_SEGMENTS.trash[index];
  const [tx1, ty1, tx2, ty2] = DOT_MORPH_SEGMENTS.check[index];

  return {
    x1: [sx1, sx1, tx1, tx1],
    y1: [sy1, sy1, ty1, ty1],
    x2: [sx2, sx2, tx2, tx2],
    y2: [sy2, sy2, ty2, ty2],
    strokeDasharray: [DOTTED, SOLID, SOLID, DOTTED],
    opacity: [1, 1, 1, 0],
  };
}

/**
 * Authored 450 ms trash -> check transition.
 *
 * The moving geometry is the compact row/column representation that looked
 * good in motion. The final 70 ms resolves onto the exact product check SVG,
 * rather than asking stroke-dash reconstruction to approximate the endpoint.
 */
export default function DotMorphIcon({
  icon = 'trash',
  size = 64,
  color = 'currentColor',
  className,
  label,
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  if (icon !== 'trash' && icon !== 'check') {
    throw new Error(`Unknown DotMorphIcon icon: ${icon}`);
  }

  if (icon === 'check' && reduceMotion) {
    return (
      <ExactCheckIcon
        width={size}
        height={size}
        className={className}
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        {...rest}
      />
    );
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={DOT_MORPH_SEGMENT_VIEWBOX}
      fill="none"
      color={color}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {DOT_MORPH_SEGMENTS.trash.map(([sx1, sy1, sx2, sy2], index) => {
        if (icon === 'trash') {
          return (
            <line
              key={index}
              x1={sx1}
              y1={sy1}
              x2={sx2}
              y2={sy2}
              stroke="currentColor"
              strokeWidth={DOT_MORPH_SEGMENT_STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={DOTTED}
            />
          );
        }

        return (
          <motion.line
            key={index}
            x1={sx1}
            y1={sy1}
            x2={sx2}
            y2={sy2}
            initial={{ opacity: 1 }}
            animate={trashToCheckLine(index)}
            transition={{
              duration: MORPH_DURATION_SECONDS,
              times: MORPH_TIMES,
              ease: [0.45, 0, 0.55, 1],
            }}
            stroke="currentColor"
            strokeWidth={DOT_MORPH_SEGMENT_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {icon === 'check' && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 1] }}
          transition={{
            duration: MORPH_DURATION_SECONDS,
            times: MORPH_TIMES,
            ease: [0.45, 0, 0.55, 1],
          }}
        >
          <ExactCheckIcon width="64" height="64" />
        </motion.g>
      )}
    </motion.svg>
  );
}

export { MORPH_DURATION_SECONDS };
