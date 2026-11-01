import { joinClasses as join } from './utils';

function Button({
  children,
  label,
  icon,
  size = 'xsmall',
  type = 'primary',
  form = 'circle',
  color = 'accent',
  state = 'default',
  fullWidth = false,
  disabled,
  className,
  onClick,
  ariaLabel,
  showDiscount = false,
  discountLabel,
  strikedLabel,
  ...rest
}) {
  const isDisabled = disabled ?? state === 'disabled';
  const hasDiscount = size === 'large' && showDiscount && Boolean(discountLabel);
  const content = label || children;

  return (
    <button
      type="button"
      className={join(
        'bitt-button',
        `bitt-button--${size}`,
        `bitt-button--${type}`,
        `bitt-button--${form}`,
        color !== 'none' && `bitt-button--${color}`,
        `bitt-button--${state}`,
        hasDiscount && 'bitt-button--has-discount',
        fullWidth && 'bitt-button--full',
        className,
      )}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      data-figma-node="5335:15155"
      {...rest}
    >
      {icon && <img className="bitt-button__icon" src={icon} alt="" aria-hidden="true" />}
      {content && (
        <span className={join('bitt-button__label', hasDiscount && 'bitt-button__label--discounted')}>
          {content}
          {hasDiscount && strikedLabel && (
            <span className="caption-striked bitt-button__striked-label">{strikedLabel}</span>
          )}
        </span>
      )}
      {hasDiscount && (
        <span className="bitt-button__discount">{discountLabel}</span>
      )}
    </button>
  );
}

export default Button;
