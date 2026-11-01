import { joinClasses as join } from './utils';

function Card({ children, state = 'default', className, onClick, ...rest }) {
  const isLoading = state === 'loading';
  const isInteractive = Boolean(onClick) && !isLoading;

  const handleKeyDown = (event) => {
    if (!isInteractive || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onClick(event);
  };

  return (
    <div
      className={join('bitt-card', `bitt-card--${state}`, isInteractive && 'bitt-card--clickable', className)}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      data-figma-node="5941:17273"
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <span className="bitt-skeleton-shine" aria-hidden="true" /> : children}
    </div>
  );
}


export default Card;
