import { useEffect, useState } from 'react';
import './CheckoutScreen.css';
import {
  calculateAccessPricing,
  calculateBonusDeduction,
  EXTRA_DEVICE_PRICE,
  PROTOTYPE_BONUS_BALANCE,
} from '../../config/pricing';
import { syncTelegramChrome } from '../../telegram';
import {
  BonusBalanceSheet,
  BonusCard,
  CheckoutSummary,
  CheckoutTabBar,
  ExtraDevicesCard,
  PaymentBreakdown,
  PaymentMethodSheet,
  getPaymentMethodLabel,
} from '../../features/checkout';

export default function CheckoutScreen({ location, months, onStartPayment }) {
  const [extraDevices, setExtraDevices] = useState(0);
  const [useBonuses, setUseBonuses] = useState(false);
  const [bonusInfoOpen, setBonusInfoOpen] = useState(false);
  const [paymentMethodOpen, setPaymentMethodOpen] = useState(false);
  const accessPricing = calculateAccessPricing(location.pricePerMonth, months);
  const accessCost = accessPricing.price;
  const extraDevicesCost = extraDevices * EXTRA_DEVICE_PRICE;
  const maxBonusDeduction = calculateBonusDeduction(PROTOTYPE_BONUS_BALANCE, accessCost + extraDevicesCost);
  const hasBonusBalance = maxBonusDeduction > 0;
  const bonusAmount = useBonuses ? maxBonusDeduction : 0;
  const total = accessCost + extraDevicesCost - bonusAmount;

  useEffect(() => {
    setExtraDevices(0);
    setUseBonuses(false);
    setBonusInfoOpen(false);
    setPaymentMethodOpen(false);
  }, [location.id]);

  useEffect(() => {
    syncTelegramChrome(bonusInfoOpen || paymentMethodOpen);
    return () => syncTelegramChrome(false);
  }, [bonusInfoOpen, paymentMethodOpen]);

  const proceedToPayment = (paymentMethod) => {
    setPaymentMethodOpen(false);
    onStartPayment?.({
      paymentMethod,
      paymentService: getPaymentMethodLabel(paymentMethod),
      total,
      months,
      extraDevices,
      accessCost,
      extraDevicesCost,
      bonusAmount,
      locationId: location.id,
      locationCode: location.code,
      locationName: location.countryName,
    });
  };

  return (
    <>
      <div
        className="scroll-area checkout-scroll-area"
        data-figma-node={paymentMethodOpen ? '7370:30600' : '6606:23733'}
      >
        <div className="checkout-content">
          <div className="checkout-top-stack">
            <CheckoutSummary locationName={location.countryName} months={months} accessCost={accessCost} />
            <ExtraDevicesCard count={extraDevices} onChange={setExtraDevices} />
          </div>
          {hasBonusBalance && (
            <BonusCard
              enabled={useBonuses}
              onChange={setUseBonuses}
              onInfo={() => setBonusInfoOpen(true)}
              infoOpen={bonusInfoOpen}
              maxDeduction={maxBonusDeduction}
            />
          )}
          <PaymentBreakdown
            accessCost={accessCost}
            originalAccessCost={accessPricing.originalPrice}
            discountAmount={accessPricing.discountAmount}
            extraDevices={extraDevices}
            extraDevicesCost={extraDevicesCost}
            bonusAmount={bonusAmount}
            total={total}
          />
        </div>
      </div>
      <CheckoutTabBar onPayment={() => setPaymentMethodOpen(true)} />
      <BonusBalanceSheet open={bonusInfoOpen} onClose={() => setBonusInfoOpen(false)} />
      <PaymentMethodSheet
        open={paymentMethodOpen}
        onClose={() => setPaymentMethodOpen(false)}
        total={total}
        onProceed={proceedToPayment}
      />
    </>
  );
}
