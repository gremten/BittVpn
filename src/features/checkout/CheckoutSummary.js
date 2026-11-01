import { Block } from '../../components/ui';
import { DetailRow } from '../../components/ui/internal';
import { formatMonths } from '../purchase';

export default function CheckoutSummary({ locationName, months, accessCost }) {
  return (
    <Block className="checkout-summary-card surface-card" aria-label="Параметры покупки">
      <DetailRow label="Локация" value={locationName} />
      <DetailRow label="Срок доступа" value={formatMonths(months)} />
      <DetailRow label="Стоимость" value={`${accessCost.toLocaleString('ru-RU')} ₽`} end />
    </Block>
  );
}
