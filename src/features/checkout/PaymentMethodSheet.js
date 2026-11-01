import { useEffect, useState } from 'react';
import { BottomSheet } from '../../components/overlays';
import { Button, Cell } from '../../components/ui';
import ukassaIcon from '../../assets/icons/payments/ukassa.svg';
import robokassaIcon from '../../assets/icons/payments/robokassa.svg';
import enotIcon from '../../assets/icons/payments/enot.svg';
import './PaymentMethodSheet.css';

export const PAYMENT_METHODS = Object.freeze([
  {
    id: 'ukassa',
    label: 'ЮKassa',
    description: 'Банковская карта • СБП',
    icon: ukassaIcon,
  },
  {
    id: 'robokassa',
    label: 'Robokassa',
    description: 'Банковская карта • СБП',
    icon: robokassaIcon,
  },
  {
    id: 'enot',
    label: 'Енот',
    description: 'Банковская карта • СБП',
    icon: enotIcon,
  },
]);

export function getPaymentMethodLabel(methodId) {
  return PAYMENT_METHODS.find((method) => method.id === methodId)?.label || PAYMENT_METHODS[0].label;
}

export default function PaymentMethodSheet({
  open,
  onClose,
  total = 0,
  onProceed,
}) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);

  useEffect(() => {
    if (open) setSelectedMethod(PAYMENT_METHODS[0].id);
  }, [open]);

  const proceed = () => {
    onProceed?.(selectedMethod);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      ariaLabel="Выбери способ оплаты"
      figmaNode="7370:32834"
      className="payment-method-sheet"
    >
      <div className="payment-method-sheet__data" data-figma-node="7370:32833">
        <h2>Выбери способ оплаты</h2>
        <div className="payment-method-sheet__list" role="radiogroup" aria-label="Способ оплаты">
          {PAYMENT_METHODS.map((method, index) => {
            const selected = method.id === selectedMethod;
            return (
              <Cell
                key={method.id}
                type="payment"
                title={method.label}
                description={method.description}
                icon={method.icon}
                selected={selected}
                last={index === PAYMENT_METHODS.length - 1}
                onClick={() => setSelectedMethod(method.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="payment-method-sheet__actions" data-figma-node="7370:31444">
        <Button
          size="large"
          type="primary"
          form="circle"
          color="accent"
          fullWidth
          onClick={proceed}
        >
          {`Оплатить ${Math.max(0, Number(total) || 0).toLocaleString('ru-RU')} ₽`}
        </Button>
        <p className="payment-method-sheet__offer">
          <span>Оплачивая, ты принимаешь </span>
          <button type="button" onClick={() => {}}>условия оферты</button>
        </p>
      </div>
    </BottomSheet>
  );
}
