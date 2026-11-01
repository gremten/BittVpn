import { joinClasses as join } from './utils';

function IconButton({
  icon,
  children,
  size = 'xsmall',
  type = 'primary',
  glass = 'none',
  color = 'accent',
  form = 'circle',
  className,
  onClick,
  ariaLabel,
  disabled = false,
  ...rest
}) {
  return (
    <button
      type="button"
      className={join(
        'bitt-icon-button',
        `bitt-icon-button--${size}`,
        `bitt-icon-button--${type}`,
        `bitt-icon-button--glass-${glass}`,
        `bitt-icon-button--${color}`,
        `bitt-icon-button--${form}`,
        className,
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      data-figma-node="5928:21084"
      {...rest}
    >
      {children || (icon && (
        disabled ? (
          <span
            className="bitt-icon-button__disabled-icon"
            aria-hidden="true"
            style={{
              WebkitMaskImage: `url(${icon})`,
              maskImage: `url(${icon})`,
            }}
          />
        ) : (
          <img src={icon} alt="" aria-hidden="true" />
        )
      ))}
    </button>
  );
}


export default IconButton;
