import { joinClasses as join } from './utils';

function ButtonGroup({ children, type = 'horizontal', className, ...rest }) {
  return (
    <div
      className={join('bitt-button-group', `bitt-button-group--${type}`, className)}
      data-figma-node="5943:17729"
      {...rest}
    >
      {children}
    </div>
  );
}

export default ButtonGroup;
