import { useEffect, useState } from 'react';
import { BottomSheet } from '../../components/overlays';
import { Button } from '../../components/ui';
import { calculateAccessPricing } from '../../config/pricing';
import DurationSlider from './DurationSlider';

export default function PurchaseDurationSheet({
  open,
  pricePerMonth,
  onClose,
  onProceed,
  title = 'На какой срок оформим доступ?',
  ctaPrefix = 'Оформить за',
  ariaLabel = 'Выбор срока подписки',
  figmaNode = '7171:123356',
  dataFigmaNode = '7166:122079',
}) {
  const [months, setMonths] = useState(1);
  const pricing = calculateAccessPricing(pricePerMonth, months);
  const hasDiscount = pricing.discountPercent > 0;

  useEffect(() => {
    if (open) setMonths(1);
  }, [open, pricePerMonth]);

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel={ariaLabel} bottomSafeArea="tabbar" figmaNode={figmaNode}>
      <div className="sheet-content">
        <div className="sheet-plan-block" data-figma-node={dataFigmaNode}>
          <h2>{title}</h2>
          <DurationSlider value={months} onChange={setMonths} />
        </div>
        <div className="sheet-button-slot">
          <Button
            size="large"
            type="primary"
            form="circle"
            color="accent"
            fullWidth
            className="sheet-buy-button"
            onClick={() => onProceed(months)}
            label={`${ctaPrefix} ${pricing.price.toLocaleString('ru-RU')} ₽`}
            showDiscount={hasDiscount}
            discountLabel={hasDiscount ? `-${pricing.discountPercent}%` : undefined}
          />
        </div>
      </div>
    </BottomSheet>
  );
}
