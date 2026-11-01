import { joinClasses as join } from '../utils';

export default function DetailRow({
  label,
  value,
  children,
  end = false,
  valueTone = 'primary',
  className,
}) {
  return (
    <div
      className={join('bitt-detail-row', end && 'bitt-detail-row--end', className)}
      data-figma-node={end ? '5964:23501' : '5964:23499'}
    >
      <span className="bitt-detail-row__label">{label}</span>
      <div className={join('bitt-detail-row__value', `bitt-detail-row__value--${valueTone}`)}>
        {children ?? value}
      </div>
    </div>
  );
}
