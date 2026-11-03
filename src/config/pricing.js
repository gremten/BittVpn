export const MAX_MONTHS = 6;
export const EXTRA_DEVICE_PRICE = 69;

// Prototype fixture: the bonus balance a person has at checkout.
// The real value comes from the backend (referral bonuses).
export const PROTOTYPE_BONUS_BALANCE = 100;

/*
  Bonus deduction rule (product decision 2026-11-03): the whole balance is
  spent, but never more than the order sum. The checkout control shows exactly
  this amount, so the label never promises more than will be deducted.
*/
export function calculateBonusDeduction(balance, orderSum) {
  const safeBalance = Math.max(0, Number(balance) || 0);
  const safeSum = Math.max(0, Number(orderSum) || 0);
  return Math.min(safeBalance, safeSum);
}

/*
  Duration discount curve from the updated purchase-sheet design.
  Months 1–2 keep the base price. Starting at month 3 the discount grows
  by 4 percentage points until the final 26% state at month 6:
  1: 0%, 2: 0%, 3: 14%, 4: 18%, 5: 22%, 6: 26%.
*/
export const DURATION_DISCOUNTS = Object.freeze({
  1: 0,
  2: 0,
  3: 14,
  4: 18,
  5: 22,
  6: 26,
});

export function getDurationDiscountPercent(months) {
  const normalizedMonths = Math.min(MAX_MONTHS, Math.max(1, Number(months) || 1));
  return DURATION_DISCOUNTS[normalizedMonths] ?? 0;
}

export function calculateAccessPricing(pricePerMonth, months) {
  const normalizedMonths = Math.min(MAX_MONTHS, Math.max(1, Number(months) || 1));
  const originalPrice = normalizedMonths * pricePerMonth;
  const discountPercent = getDurationDiscountPercent(normalizedMonths);

  // Figma's 3-month reference is 960 ₽ → 825 ₽ at -14%, so fractional
  // rubles are intentionally rounded down instead of mathematically rounded.
  const price = discountPercent > 0
    ? Math.floor((originalPrice * (100 - discountPercent)) / 100)
    : originalPrice;

  return {
    months: normalizedMonths,
    originalPrice,
    discountPercent,
    discountAmount: originalPrice - price,
    price,
  };
}
