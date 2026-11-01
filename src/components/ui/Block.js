import { joinClasses as join } from './utils';

function Block({ children, state = 'default', type = 'regular', className, ...rest }) {
  const isLoading = state === 'loading';

  return (
    <section
      className={join('bitt-block', `bitt-block--${state}`, `bitt-block--${type}`, className)}
      data-figma-node="5943:16932"
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <span className="bitt-skeleton-shine" aria-hidden="true" /> : children}
    </section>
  );
}


export default Block;
