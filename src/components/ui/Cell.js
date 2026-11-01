import radioOn from '../../assets/icons/nav/Icn_m_radio-on.svg';
import radioOff from '../../assets/icons/nav/icn_m_radio-off.svg';
import { joinClasses as join } from './utils';

function PaymentCell({
  title,
  description,
  icon,
  selected = false,
  last = false,
  onClick,
  className,
}) {
  return (
    <button
      type="button"
      className={join(
        'bitt-cell',
        'bitt-cell--payment',
        selected && 'bitt-cell--payment-selected',
        last && 'bitt-cell--payment-last',
        className,
      )}
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      data-figma-node={selected ? '7370:32485' : '7370:32431'}
    >
      {icon && <img className="bitt-cell__payment-icon" src={icon} alt="" aria-hidden="true" />}
      <span className="bitt-cell__payment-container">
        <span className="bitt-cell__payment-content">
          <span className="bitt-cell__payment-copy">
            <span className="bitt-cell__payment-title">{title}</span>
            {description && <span className="bitt-cell__payment-description">{description}</span>}
          </span>
          <img
            className="bitt-cell__payment-radio"
            src={selected ? radioOn : radioOff}
            alt=""
            aria-hidden="true"
          />
        </span>
      </span>
    </button>
  );
}

function Cell({
  type = 'order',
  state = 'in processing',
  title,
  description,
  value,
  icon,
  selected,
  last,
  onClick,
  className,
}) {
  if (type === 'payment') {
    return (
      <PaymentCell
        title={title}
        description={description}
        icon={icon}
        selected={selected}
        last={last}
        onClick={onClick}
        className={className}
      />
    );
  }

  return (
    <div className={join('bitt-cell', `bitt-cell--${type}`, `bitt-cell--${state.replace(/\s+/g, '-')}`, className)} data-figma-node="6432:30801">
      {icon && <img className="bitt-cell__icon" src={icon} alt="" aria-hidden="true" />}
      <div className="bitt-cell__copy">
        <span className="bitt-cell__title">{title}</span>
        {description && <span className="bitt-cell__description">{description}</span>}
      </div>
      {value != null && <span className="bitt-cell__value">{value}</span>}
    </div>
  );
}

export default Cell;
