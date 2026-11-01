import { joinClasses as join } from './utils';

function cssLength(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Generic loading placeholder for UI that is not itself a Block/Card.
 *
 * type="font": height equals the final text line-height.
 * type="control": mirrors the final control's width/height/radius.
 */
function Skeleton({
  type = 'font',
  width = '100%',
  lineHeight = 20,
  height,
  radius,
  className,
  ...rest
}) {
  const resolvedHeight = type === 'font' ? lineHeight : (height ?? lineHeight);
  const resolvedRadius = radius ?? (type === 'font' ? 999 : 12);

  return (
    <span
      className={join('bitt-skeleton', `bitt-skeleton--${type}`, className)}
      style={{
        width: cssLength(width),
        height: cssLength(resolvedHeight),
        borderRadius: cssLength(resolvedRadius),
      }}
      aria-hidden="true"
      {...rest}
    >
      <span className="bitt-skeleton-shine" aria-hidden="true" />
    </span>
  );
}

export default Skeleton;
