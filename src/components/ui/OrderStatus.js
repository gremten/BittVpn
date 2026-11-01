import { motion, useReducedMotion } from 'motion/react';
import checkIcon from '../../assets/icons/order-status/check.png';
import timeIcon from '../../assets/icons/order-status/time.png';
import crossIcon from '../../assets/icons/order-status/cross.png';
import { joinClasses as join } from './utils';

const STATUS_ICONS = Object.freeze({
  success: checkIcon,
  processing: timeIcon,
  failure: crossIcon,
});

const STATUS_MORPH_DURATION_SECONDS = 0.45;
const STATUS_DOT_RADIUS = 1.56;
const STATUS_MORPH_TIMES = [0, 0.18, 0.78, 1];

// Pixel centers extracted from the durable local 64×64 status PNGs.
// Keeping the exact source distribution lets the animated timer start on the
// same dot matrix that the static OrderStatus already renders.
const TIME_DOTS = Object.freeze([
  [45.656, 3.167], [31.371, 3.169], [17.235, 3.235], [8.030, 3.333],
  [12.895, 3.334], [22.061, 3.337], [54.980, 3.343], [36.071, 3.344],
  [40.949, 3.344], [26.918, 3.347], [50.082, 3.347], [17.463, 8.018],
  [45.532, 8.027], [31.495, 8.028], [50.284, 8.030], [54.942, 8.033],
  [36.277, 8.040], [22.078, 8.052], [8.034, 8.060], [40.832, 8.098],
  [26.820, 8.100], [12.809, 8.101], [12.818, 12.817], [50.172, 12.819],
  [12.917, 17.361], [26.917, 17.361], [36.066, 17.467], [50.077, 17.486],
  [17.481, 22.047], [31.500, 22.057], [45.533, 22.066], [40.872, 26.827],
  [22.142, 26.831], [36.067, 31.495], [26.933, 31.505], [40.859, 36.171],
  [22.127, 36.173], [17.467, 40.934], [45.520, 40.953], [12.923, 45.514],
  [50.083, 45.639], [50.183, 50.183], [12.818, 50.183], [50.191, 54.900],
  [36.180, 54.901], [22.168, 54.903], [54.966, 54.941], [40.923, 54.948],
  [26.722, 54.960], [17.463, 54.963], [8.060, 54.967], [12.715, 54.970],
  [31.504, 54.972], [45.524, 54.982], [12.918, 59.653], [36.082, 59.653],
  [8.019, 59.656], [22.051, 59.656], [26.929, 59.656], [40.939, 59.663],
  [54.969, 59.666], [50.105, 59.666], [45.766, 59.764], [31.629, 59.831],
  [17.345, 59.833],
]);

const CHECK_DOTS = Object.freeze([
  [54.900, 12.808], [54.982, 17.477], [50.077, 17.486], [50.280, 22.050],
  [45.533, 22.066], [40.862, 26.834], [45.640, 26.917], [36.067, 31.495],
  [40.943, 31.500], [8.027, 31.505], [31.505, 36.067], [12.813, 36.141],
  [36.159, 36.150], [8.099, 36.180], [26.830, 40.857], [17.467, 40.934],
  [31.500, 40.943], [12.720, 40.949], [22.047, 45.519], [26.934, 45.533],
  [17.360, 45.831], [22.121, 50.194],
]);

function distanceSquared([ax, ay], [bx, by]) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

const TIME_TO_CHECK_TARGETS = Object.freeze(TIME_DOTS.map((source) => {
  let target = CHECK_DOTS[0];
  let bestDistance = distanceSquared(source, target);

  for (let index = 1; index < CHECK_DOTS.length; index += 1) {
    const candidate = CHECK_DOTS[index];
    const candidateDistance = distanceSquared(source, candidate);
    if (candidateDistance < bestDistance) {
      target = candidate;
      bestDistance = candidateDistance;
    }
  }

  return target;
}));

function ProcessingToSuccessMorph({ size }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <img
        className="bitt-order-status__icon"
        src={checkIcon}
        alt=""
        aria-hidden="true"
        style={{ width: size, height: size, flexBasis: size }}
      />
    );
  }

  return (
    <span
      className="bitt-order-status__morph"
      aria-hidden="true"
      style={{ width: size, height: size, flexBasis: size }}
    >
      <motion.img
        className="bitt-order-status__morph-layer"
        src={timeIcon}
        alt=""
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: STATUS_MORPH_DURATION_SECONDS,
          times: [0, 0.12, 0.28, 1],
          ease: [0.45, 0, 0.55, 1],
        }}
      />

      <motion.svg
        className="bitt-order-status__morph-layer"
        viewBox="0 0 64 64"
        fill="none"
      >
        {TIME_DOTS.map(([sx, sy], index) => {
          const [tx, ty] = TIME_TO_CHECK_TARGETS[index];
          return (
            <motion.circle
              key={`${sx}-${sy}`}
              cx={sx}
              cy={sy}
              r={STATUS_DOT_RADIUS}
              fill="currentColor"
              initial={{ opacity: 0 }}
              animate={{
                cx: [sx, sx, tx, tx],
                cy: [sy, sy, ty, ty],
                opacity: [0, 1, 0.92, 0],
                r: [STATUS_DOT_RADIUS, STATUS_DOT_RADIUS, STATUS_DOT_RADIUS, 1.3],
              }}
              transition={{
                duration: STATUS_MORPH_DURATION_SECONDS,
                times: STATUS_MORPH_TIMES,
                ease: [0.45, 0, 0.55, 1],
              }}
            />
          );
        })}
      </motion.svg>

      <motion.img
        className="bitt-order-status__morph-layer"
        src={checkIcon}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1] }}
        transition={{
          duration: STATUS_MORPH_DURATION_SECONDS,
          times: STATUS_MORPH_TIMES,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
    </span>
  );
}

function OrderStatus({
  type = 'success',
  state = 'default',
  label,
  className,
  icon: iconOverride,
  iconSize = 64,
  morphFrom,
}) {
  const icon = iconOverride || STATUS_ICONS[type] || STATUS_ICONS.success;
  const processingToSuccess = state !== 'loading'
    && type === 'success'
    && morphFrom === 'processing'
    && !iconOverride;

  return (
    <div
      className={join('bitt-order-status', `bitt-order-status--${type}`, `bitt-order-status--${state}`, className)}
      data-figma-node="6532:49948"
    >
      {state === 'loading' ? (
        <span className="bitt-order-status__skeleton-shine" aria-hidden="true" />
      ) : processingToSuccess ? (
        <ProcessingToSuccessMorph size={iconSize} />
      ) : (
        <img
          className="bitt-order-status__icon"
          src={icon}
          alt=""
          aria-hidden="true"
          style={{ width: iconSize, height: iconSize, flexBasis: iconSize }}
        />
      )}
      {label && <span className="bitt-order-status__label">{label}</span>}
    </div>
  );
}

export default OrderStatus;
export { STATUS_MORPH_DURATION_SECONDS };
