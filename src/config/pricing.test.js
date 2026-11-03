import { calculateBonusDeduction } from './pricing';

describe('calculateBonusDeduction', () => {
  test('deducts the whole balance when it is below the order sum', () => {
    expect(calculateBonusDeduction(100, 246)).toBe(100);
  });

  test('never deducts more than the order sum', () => {
    expect(calculateBonusDeduction(1000, 177)).toBe(177);
  });

  test('returns 0 when there is no balance', () => {
    expect(calculateBonusDeduction(0, 177)).toBe(0);
  });

  test('treats negative or invalid input as 0', () => {
    expect(calculateBonusDeduction(-50, 177)).toBe(0);
    expect(calculateBonusDeduction(undefined, 177)).toBe(0);
    expect(calculateBonusDeduction(100, -1)).toBe(0);
  });
});
