import { Block } from '../../components/ui';

function OptionalPaymentLine({ visible, children }) {
  return (
    <div
      className={`checkout-payment-line-slot${visible ? ' checkout-payment-line-slot--visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="checkout-payment-line-slot__inner">
        {children}
      </div>
    </div>
  );
}

export default function PaymentBreakdown({
  accessCost,
  originalAccessCost,
  discountAmount,
  extraDevices,
  extraDevicesCost,
  bonusAmount,
  total,
}) {
  const hasExtraDevices = extraDevices > 0 && extraDevicesCost > 0;
  const hasBonuses = bonusAmount > 0;
  const hasDiscount = discountAmount > 0;
  const displayedAccessCost = hasDiscount ? originalAccessCost : accessCost;

  return (
    <Block className="checkout-payment-card surface-card">
      <div className="checkout-payment-total">
        <span>к оплате</span>
        <strong>{`${total.toLocaleString('ru-RU')} ₽`}</strong>
      </div>
      <div className="checkout-payment-separator" aria-hidden="true" />
      <div className="checkout-payment-lines">
        <div className="checkout-payment-line">
          <span>Стоимость доступа</span>
          <strong>{`${displayedAccessCost.toLocaleString('ru-RU')} ₽`}</strong>
        </div>

        <OptionalPaymentLine visible={hasExtraDevices}>
          <div className="checkout-payment-line">
            <span>{`Доп. устройства (${extraDevices})`}</span>
            <strong>{`+${extraDevicesCost.toLocaleString('ru-RU')} ₽`}</strong>
          </div>
        </OptionalPaymentLine>

        <OptionalPaymentLine visible={hasBonuses}>
          <div className="checkout-payment-line">
            <span>Оплата бонусами</span>
            <strong>{`-${bonusAmount.toLocaleString('ru-RU')} ₽`}</strong>
          </div>
        </OptionalPaymentLine>

        <OptionalPaymentLine visible={hasDiscount}>
          <div className="checkout-payment-line">
            <span>Скидка</span>
            <strong>{`-${discountAmount.toLocaleString('ru-RU')} ₽`}</strong>
          </div>
        </OptionalPaymentLine>
      </div>
    </Block>
  );
}
