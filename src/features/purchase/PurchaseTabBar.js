import { AppTabBar, Button } from '../../components/ui';

export default function PurchaseTabBar({ pricePerMonth, onBuy, hidden }) {
  return (
    <AppTabBar type="action" showSubtle={false} hidden={hidden}>
      <Button size="large" type="primary" form="circle" color="accent" fullWidth className="purchase-cta" onClick={onBuy}>
        <span className="purchase-cta-copy">
          <span>Купить доступ</span>
          <small>{`от ${pricePerMonth.toLocaleString('ru-RU')} ₽ / месяц`}</small>
        </span>
      </Button>
    </AppTabBar>
  );
}
