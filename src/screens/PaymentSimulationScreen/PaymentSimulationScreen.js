import './PaymentSimulationScreen.css';
import { AppTabBar, Button } from '../../components/ui';
import paymentPreview from '../../assets/images/payment/ukassa-payment.webp';

export const PAYMENT_SIMULATION_FIGMA_NODE = '7370:33064';

export default function PaymentSimulationScreen({ onSimulatePayment }) {
  return (
    <div className="payment-simulation-screen" data-figma-node={PAYMENT_SIMULATION_FIGMA_NODE}>
      <img
        className="payment-simulation-screen__image"
        src={paymentPreview}
        alt="Экран имитации оплаты"
      />

      <AppTabBar type="action" showSubtle={false}>
        <Button
          size="large"
          type="primary"
          form="circle"
          color="accent"
          fullWidth
          onClick={onSimulatePayment}
        >
          Оплатить (Имитация)
        </Button>
      </AppTabBar>
    </div>
  );
}
