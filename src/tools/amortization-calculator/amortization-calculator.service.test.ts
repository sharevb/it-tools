import { beforeEach, describe, expect, it } from 'vitest';
import {
  AmortizationCalculator,
  type AmortizationParams,
  StandardAmortizationCalculator,
} from './amortization-calculator.service';

describe('AmortizationCalculator', () => {
  describe('validation methods', () => {
    describe('validateLoanAmount', () => {
      it('validates positive numbers', () => {
        expect(AmortizationCalculator.validateLoanAmount('100000')).toBe(true);
        expect(AmortizationCalculator.validateLoanAmount('1.5')).toBe(true);
        expect(AmortizationCalculator.validateLoanAmount('0.01')).toBe(true);
      });

      it('rejects zero and negative numbers', () => {
        expect(AmortizationCalculator.validateLoanAmount('0')).toBe(false);
        expect(AmortizationCalculator.validateLoanAmount('-100')).toBe(false);
      });

      it('rejects invalid inputs', () => {
        expect(AmortizationCalculator.validateLoanAmount('')).toBe(false);
        expect(AmortizationCalculator.validateLoanAmount('abc')).toBe(false);
        expect(AmortizationCalculator.validateLoanAmount('NaN')).toBe(false);
      });

      it('rejects infinity', () => {
        expect(AmortizationCalculator.validateLoanAmount('Infinity')).toBe(false);
      });
    });

    describe('validateLoanMonths', () => {
      it('validates positive integers', () => {
        expect(AmortizationCalculator.validateLoanMonths('12')).toBe(true);
        expect(AmortizationCalculator.validateLoanMonths('360')).toBe(true);
        expect(AmortizationCalculator.validateLoanMonths('1')).toBe(true);
      });

      it('rejects non-integers', () => {
        expect(AmortizationCalculator.validateLoanMonths('12.5')).toBe(false);
        expect(AmortizationCalculator.validateLoanMonths('1.1')).toBe(false);
      });

      it('rejects zero and negative numbers', () => {
        expect(AmortizationCalculator.validateLoanMonths('0')).toBe(false);
        expect(AmortizationCalculator.validateLoanMonths('-12')).toBe(false);
      });

      it('rejects invalid inputs', () => {
        expect(AmortizationCalculator.validateLoanMonths('')).toBe(false);
        expect(AmortizationCalculator.validateLoanMonths('abc')).toBe(false);
      });
    });

    describe('validateInterestRate', () => {
      it('validates fractional interest rates between 0 and 100', () => {
        expect(AmortizationCalculator.validateInterestRate('5.5')).toBe(true);
        expect(AmortizationCalculator.validateInterestRate('0.01')).toBe(true);
        expect(AmortizationCalculator.validateInterestRate('100')).toBe(true);
        expect(AmortizationCalculator.validateInterestRate('12.75')).toBe(true);
      });

      it('rejects rates above 100', () => {
        expect(AmortizationCalculator.validateInterestRate('100.01')).toBe(false);
        expect(AmortizationCalculator.validateInterestRate('200')).toBe(false);
      });

      it('rejects zero and negative rates', () => {
        expect(AmortizationCalculator.validateInterestRate('0')).toBe(false);
        expect(AmortizationCalculator.validateInterestRate('-5')).toBe(false);
      });

      it('rejects invalid inputs', () => {
        expect(AmortizationCalculator.validateInterestRate('')).toBe(false);
        expect(AmortizationCalculator.validateInterestRate('abc')).toBe(false);
      });

      it('rejects infinity', () => {
        expect(AmortizationCalculator.validateInterestRate('Infinity')).toBe(false);
      });
    });
  });
});

describe('StandardAmortizationCalculator', () => {
  let calculator: StandardAmortizationCalculator;

  beforeEach(() => {
    calculator = new StandardAmortizationCalculator();
  });

  describe('getPayment', () => {
    it('calculates correct payment for standard loan parameters', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005, // 0.5% monthly (6% annual)
        numberOfPayments: 360, // 30 years
      };

      const result = calculator.getPayment(params);

      // Expected payment using standard amortization formula
      // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
      // Where P is payment, L is loan amount, c is interest rate per period, n is number of periods
      expect(result.payment).toBeCloseTo(599.55, 2);
      expect(result.totalPayments).toBeCloseTo(215838, 0);
    });

    it('calculates correct payment for short-term loan', () => {
      const params: AmortizationParams = {
        principal: 10000,
        periodInterestRate: 0.01, // 1% monthly
        numberOfPayments: 12,
      };

      const result = calculator.getPayment(params);

      expect(result.payment).toBeCloseTo(888.49, 2);
      expect(result.totalPayments).toBeCloseTo(10661.85, 2);
    });

    it('calculates correct payment with zero interest rate', () => {
      const params: AmortizationParams = {
        principal: 12000,
        periodInterestRate: 0,
        numberOfPayments: 12,
      };

      const result = calculator.getPayment(params);

      // With 0% interest, payment should be principal / numberOfPayments
      expect(result.payment).toBe(1000);
      expect(result.totalPayments).toBe(12000);
    });

    it('caches payment calculations', () => {
      const params: AmortizationParams = {
        principal: 50000,
        periodInterestRate: 0.004,
        numberOfPayments: 180,
      };

      const result1 = calculator.getPayment(params);
      const result2 = calculator.getPayment(params);

      // Should return the same object reference from cache
      expect(result1).toBe(result2);
      expect(result1.payment).toBeCloseTo(390.21, 2);
    });

    it('calculates different payments for different parameters', () => {
      const params1: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const params2: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.004,
        numberOfPayments: 360,
      };

      const result1 = calculator.getPayment(params1);
      const result2 = calculator.getPayment(params2);

      expect(result1.payment).not.toBe(result2.payment);
      expect(result1.payment).toBeGreaterThan(result2.payment);
    });
  });

  describe('getNth', () => {
    it('calculates correct values for first payment', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const result = calculator.getNth(params, 1);

      expect(result.paymentIndex).toBe(1);
      expect(result.payment).toBeCloseTo(599.55, 2);

      // First payment: more interest, less principal in standard amortization
      expect(result.interestPayment).toBeCloseTo(500, 2); // 100000 * 0.005
      expect(result.principalPayment).toBeCloseTo(99.55, 2); // 599.55 - 500
      expect(result.remainingBalance).toBeCloseTo(99900.45, 2); // 100000 - 99.55

      // Payment should equal principal + interest
      expect(result.principalPayment + result.interestPayment).toBeCloseTo(result.payment, 2);
    });

    it('calculates correct values for middle payment', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const result = calculator.getNth(params, 180);

      expect(result.paymentIndex).toBe(180);
      expect(result.remainingBalance).toBeGreaterThan(0);
      expect(result.remainingBalance).toBeLessThan(params.principal);
      expect(result.principalPayment + result.interestPayment).toBeCloseTo(result.payment, 2);
    });

    it('calculates correct values for final payment', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const result = calculator.getNth(params, 360);

      expect(result.paymentIndex).toBe(360);
      // Last payment should have remaining balance close to 0
      expect(result.remainingBalance).toBeCloseTo(0, 0);
      expect(result.principalPayment + result.interestPayment).toBeCloseTo(result.payment, 2);
    });

    it('shows increasing principal payment over time for standard amortization', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const payment1 = calculator.getNth(params, 1);
      const payment180 = calculator.getNth(params, 180);
      const payment360 = calculator.getNth(params, 360);

      // In standard amortization, principal payment increases as balance decreases
      expect(payment1.principalPayment).toBeLessThan(payment180.principalPayment);
      expect(payment180.principalPayment).toBeLessThan(payment360.principalPayment);
    });

    it('shows decreasing interest payment over time', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 360,
      };

      const payment1 = calculator.getNth(params, 1);
      const payment180 = calculator.getNth(params, 180);
      const payment360 = calculator.getNth(params, 360);

      // Interest payment should decrease over time
      expect(payment1.interestPayment).toBeGreaterThan(payment180.interestPayment);
      expect(payment180.interestPayment).toBeGreaterThan(payment360.interestPayment);
    });

    it('handles zero interest rate correctly', () => {
      const params: AmortizationParams = {
        principal: 12000,
        periodInterestRate: 0,
        numberOfPayments: 12,
      };

      const result = calculator.getNth(params, 1);

      expect(result.payment).toBe(1000);
      expect(result.interestPayment).toBe(0);
      expect(result.principalPayment).toBeGreaterThan(0);
    });
  });

  describe('getAmortizationSchedule', () => {
    it('generates complete amortization schedule with month and year rows', () => {
      const params: AmortizationParams = {
        principal: 10000,
        periodInterestRate: 0.01,
        numberOfPayments: 12,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));

      // 12 months + 1 year summary row = 13 total
      expect(schedule).toHaveLength(13);
      expect(schedule[0].paymentIndex).toBe(1);
      expect(schedule[0].type).toBe('month');
      expect(schedule[11].paymentIndex).toBe(12);
      expect(schedule[11].type).toBe('month');
      expect(schedule[12].type).toBe('year');
      expect(schedule[12].paymentIndex).toBe(1); // Year 1
    });

    it('ensures each payment has consistent structure', () => {
      const params: AmortizationParams = {
        principal: 50000,
        periodInterestRate: 0.004,
        numberOfPayments: 60,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));

      // 60 months + 5 year summary rows = 65 total
      expect(schedule).toHaveLength(65);

      const monthRows = schedule.filter(row => row.type === 'month');
      const yearRows = schedule.filter(row => row.type === 'year');

      expect(monthRows).toHaveLength(60);
      expect(yearRows).toHaveLength(5);

      monthRows.forEach((payment, index) => {
        expect(payment).toHaveProperty('paymentIndex');
        expect(payment).toHaveProperty('payment');
        expect(payment).toHaveProperty('principalPayment');
        expect(payment).toHaveProperty('interestPayment');
        expect(payment).toHaveProperty('remainingBalance');
        expect(payment).toHaveProperty('totalPayments');
        expect(payment).toHaveProperty('type');

        expect(payment.paymentIndex).toBe(index + 1);
        expect(payment.principalPayment + payment.interestPayment).toBeCloseTo(payment.payment, 2);
      });
    });

    it('shows decreasing remaining balance over time', () => {
      const params: AmortizationParams = {
        principal: 20000,
        periodInterestRate: 0.005,
        numberOfPayments: 24,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));

      // Filter to only month rows for balance comparison
      const monthRows = schedule.filter(row => row.type === 'month');

      for (let i = 1; i < monthRows.length; i++) {
        expect(monthRows[i].remainingBalance).toBeLessThan(monthRows[i - 1].remainingBalance);
      }
    });

    it('ends with near-zero remaining balance', () => {
      const params: AmortizationParams = {
        principal: 15000,
        periodInterestRate: 0.0075,
        numberOfPayments: 36,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      const monthRows = schedule.filter(row => row.type === 'month');
      const lastMonthPayment = monthRows[monthRows.length - 1];

      expect(lastMonthPayment.remainingBalance).toBeCloseTo(0, 0);
    });

    it('handles single payment loan', () => {
      const params: AmortizationParams = {
        principal: 1000,
        periodInterestRate: 0.05,
        numberOfPayments: 1,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));

      // Single payment with no year summary (< 12 months)
      expect(schedule).toHaveLength(1);
      expect(schedule[0].paymentIndex).toBe(1);
      expect(schedule[0].type).toBe('month');
      expect(schedule[0].payment).toBeCloseTo(1050, 2);
    });

    it('maintains consistent payment amount throughout schedule', () => {
      const params: AmortizationParams = {
        principal: 25000,
        periodInterestRate: 0.006,
        numberOfPayments: 48,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      const monthRows = schedule.filter(row => row.type === 'month');
      const firstPayment = monthRows[0].payment;

      monthRows.forEach((payment) => {
        expect(payment.payment).toBeCloseTo(firstPayment, 2);
      });
    });

    it('includes year summary rows after every 12 months', () => {
      const params: AmortizationParams = {
        principal: 100000,
        periodInterestRate: 0.005,
        numberOfPayments: 24,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      const yearRows = schedule.filter(row => row.type === 'year');

      expect(yearRows).toHaveLength(2); // 2 years
      expect(yearRows[0].paymentIndex).toBe(1); // Year 1
      expect(yearRows[1].paymentIndex).toBe(2); // Year 2
    });

    it('year summary rows contain cumulative totals', () => {
      const params: AmortizationParams = {
        principal: 10000,
        periodInterestRate: 0.01,
        numberOfPayments: 12,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      const monthRows = schedule.filter(row => row.type === 'month');
      const yearRows = schedule.filter(row => row.type === 'year');

      // Calculate cumulative totals for the year
      const totalPrincipal = monthRows.reduce((sum, row) => sum + row.principalPayment, 0);
      const totalInterest = monthRows.reduce((sum, row) => sum + row.interestPayment, 0);

      expect(yearRows[0].principalPayment).toBeCloseTo(totalPrincipal, 2);
      expect(yearRows[0].interestPayment).toBeCloseTo(totalInterest, 2);
    });
  });

  describe('edge cases', () => {
    it('handles very small loan amounts', () => {
      const params: AmortizationParams = {
        principal: 100,
        periodInterestRate: 0.01,
        numberOfPayments: 12,
      };

      const result = calculator.getPayment(params);
      expect(result.payment).toBeGreaterThan(0);
      expect(result.totalPayments).toBeGreaterThan(params.principal);
    });

    it('handles very large loan amounts', () => {
      const params: AmortizationParams = {
        principal: 10000000,
        periodInterestRate: 0.003,
        numberOfPayments: 360,
      };

      const result = calculator.getPayment(params);
      expect(result.payment).toBeGreaterThan(0);
      expect(Number.isFinite(result.payment)).toBe(true);
    });

    it('handles very low interest rates', () => {
      const params: AmortizationParams = {
        principal: 50000,
        periodInterestRate: 0.0001,
        numberOfPayments: 60,
      };

      const result = calculator.getPayment(params);
      expect(result.payment).toBeGreaterThan(params.principal / params.numberOfPayments);
    });

    it('handles short loan terms', () => {
      const params: AmortizationParams = {
        principal: 5000,
        periodInterestRate: 0.02,
        numberOfPayments: 3,
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      // 3 months, no year summary (< 12 months)
      expect(schedule).toHaveLength(3);
      const monthRows = schedule.filter(row => row.type === 'month');
      expect(monthRows[2].remainingBalance).toBeCloseTo(0, 0);
    });

    it('handles long loan terms', () => {
      const params: AmortizationParams = {
        principal: 200000,
        periodInterestRate: 0.004,
        numberOfPayments: 480, // 40 years
      };

      const schedule = Array.from(calculator.getAmortizationSchedule(params));
      // 480 months + 40 year summary rows = 520 total
      expect(schedule).toHaveLength(520);
      const monthRows = schedule.filter(row => row.type === 'month');
      expect(monthRows).toHaveLength(480);
      expect(monthRows[479].remainingBalance).toBeCloseTo(0, 0);
    });
  });
});
