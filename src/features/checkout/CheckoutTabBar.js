import { AppTabBar, Button } from '../../components/ui';

export default function CheckoutTabBar({ onPayment }) {
  return (
    <AppTabBar type="action" showSubtle={false}>
      <Button
        size="large"
        type="primary"
        form="circle"
        color="accent"
        fullWidth
        className="checkout-payment-button"
        onClick={onPayment}
      >
        Перейти к оплате
      </Button>
    </AppTabBar>
  );
}
