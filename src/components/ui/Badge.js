import { joinClasses as join } from './utils';

function Badge({
  children,
  size = 'xsmall',
  color = 'surface',
  icon,
  leadingIcon,
  trailingIcon,
  className,
}) {
  const resolvedLeadingIcon = leadingIcon || icon;

  return (
    <span
      className={join('bitt-badge', `bitt-badge--${size}`, `bitt-badge--${color}`, className)}
      data-figma-node="5964:23023"
    >
      {resolvedLeadingIcon && (
        <img className="bitt-badge__icon bitt-badge__icon--leading" src={resolvedLeadingIcon} alt="" aria-hidden="true" />
      )}
      <span>{children}</span>
      {trailingIcon && (
        <img className="bitt-badge__icon bitt-badge__icon--trailing" src={trailingIcon} alt="" aria-hidden="true" />
      )}
    </span>
  );
}

export default Badge;
