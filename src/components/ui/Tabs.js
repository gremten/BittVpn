import { joinClasses as join } from './utils';

export default function Tabs({
  label,
  state = 'default',
  onClick,
  className,
  ...props
}) {
  const isActive = state === 'active';

  return (
    <button
      type="button"
      className={join('bitt-tabs', isActive && 'bitt-tabs--active', className)}
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      data-figma-node={isActive ? '7435:37022' : '7435:37023'}
      {...props}
    >
      <span className="bitt-tabs__label">{label}</span>
      <span className="bitt-tabs__indicator" aria-hidden="true" />
    </button>
  );
}
