import { Block, IconButton } from '../../components/ui';
import { EXTRA_DEVICE_PRICE } from '../../config/pricing';
import plusIcon from '../../assets/icons/plus.svg';
import minusIcon from '../../assets/icons/minus.svg';

const MAX_EXTRA_DEVICES = 5;

export default function ExtraDevicesCard({ count, onChange }) {
  const isActive = count > 0;
  const isAtMax = count >= MAX_EXTRA_DEVICES;
  const increment = () => onChange(Math.min(MAX_EXTRA_DEVICES, count + 1));
  const decrement = () => onChange(Math.max(0, count - 1));

  return (
    <Block
      className={isActive ? 'checkout-devices-card checkout-devices-card--active surface-card' : 'checkout-devices-card surface-card'}
      data-figma-node={isActive ? '6606:23720' : '6593:22749'}
    >
      <div className="checkout-devices-copy">
        <div className="body-medium">Доп. устройства</div>
        <div className="checkout-devices-secondary" aria-live="polite">
          <div className="checkout-devices-caption">{`5 уже включено, дальше по ${EXTRA_DEVICE_PRICE} ₽`}</div>
          <div className="checkout-devices-price">{`${Math.max(1, count) * EXTRA_DEVICE_PRICE} ₽`}</div>
        </div>
      </div>

      <div className={isActive ? 'checkout-device-control checkout-device-control--expanded' : 'checkout-device-control'} role={isActive ? 'group' : undefined} aria-label={isActive ? 'Дополнительные устройства' : undefined}>
        <IconButton className="checkout-device-control__minus" size="medium" type="primary" form="squircle" color="elevated" icon={minusIcon} ariaLabel="Уменьшить количество" disabled={!isActive} onClick={decrement} />
        <span className="checkout-device-control__count" aria-live="polite" aria-hidden={!isActive}>{Math.max(1, count)}</span>
        <IconButton className="checkout-device-control__plus" size="medium" type="primary" form="squircle" color="elevated" icon={plusIcon} ariaLabel={isActive ? 'Увеличить количество' : 'Добавить дополнительное устройство'} disabled={isAtMax} onClick={increment} />
      </div>
    </Block>
  );
}
