import { joinClasses as join } from './utils';

function Chip({ children, size = 'small', state = 'default', onClick, className }) {
  return (
    <button
      type="button"
      className={join('bitt-chip', `bitt-chip--${size}`, `bitt-chip--${state}`, className)}
      onClick={onClick}
      disabled={state === 'loading'}
      aria-busy={state === 'loading' || undefined}
      aria-label={state === 'loading' ? 'Загрузка' : undefined}
      data-figma-node="6436:32497"
    >
      {state === 'loading' ? (
        <span className="bitt-skeleton-shine" aria-hidden="true" />
      ) : children}
    </button>
  );
}


export default Chip;
