export interface AmortizationParams {
  readonly principle: number;
  readonly periodInterestRate: number;
  readonly numberOfPayments: number;
}

export interface CachedPaymentResults {
  readonly payment: number;
  readonly totalPayments: number;
}

export interface GetNthResult extends CachedPaymentResults {
  readonly paymentIndex: number;
  readonly principlePayment: number;
  readonly interestPayment: number;
  readonly remainingBalance: number;
}

export interface AmortizationScheduleItem extends GetNthResult {
  readonly type: 'month' | 'year';
}

type AmortizationPaymentCacheKey = `principle:${number};interest-rate:${number};number-of-payments:${number}`;

export abstract class AmortizationCalculator {
  public static validateLoanAmount(str: string): boolean {
    return AmortizationCalculator.validatePositive(str);
  }

  public static validateLoanMonths(str: string): boolean {
    return AmortizationCalculator.validatePositiveInteger(str);
  }

  public static validateInterestRate(str: string): boolean {
    return AmortizationCalculator.validateFractional(str);
  }

  abstract getNth(params: AmortizationParams, paymentIndex: number): GetNthResult;

  public *getAmortizationSchedule(params: AmortizationParams): Generator<AmortizationScheduleItem> {
    let period = 0;
    let periodTotalPrinciple = 0;
    let periodTotalInterest = 0;

    while (period < params.numberOfPayments) {
      const periodResults = this.getNth(params, ++period);

      periodTotalPrinciple += periodResults.principlePayment;
      periodTotalInterest += periodResults.interestPayment;

      yield {
        ...periodResults,
        type: 'month',
      };

      // Yield yearly totals at end of year
      if (period % 12 === 0) {
        yield {
          ...periodResults,
          paymentIndex: period / 12,
          principlePayment: periodTotalPrinciple,
          interestPayment: periodTotalInterest,
          type: 'year',
        };

        periodTotalPrinciple = 0;
        periodTotalInterest = 0;
      }
    }
  }

  public getPayment(params: AmortizationParams): CachedPaymentResults {
    const cacheKey = this.getCacheString(params);
    const cache = this.paymentCache.get(cacheKey);

    if (!cache) {
      const payment = this.calculatePayment(params);
      const totalPayments = this.calculateTotalPayments(params, payment);

      const paymentResult = {
        payment,
        totalPayments,
      };

      this.paymentCache.set(cacheKey, paymentResult);

      return paymentResult;
    } else {
      return cache;
    }
  }

  /** Private Methods */
  private paymentCache: Map<AmortizationPaymentCacheKey, CachedPaymentResults> = new Map();

  private calculatePayment({ principle, periodInterestRate, numberOfPayments }: AmortizationParams): number {
    if (periodInterestRate === 0) {
      return principle / numberOfPayments;
    }

    const numerator = periodInterestRate * (1 + periodInterestRate) ** numberOfPayments;
    const denominator = (1 + periodInterestRate) ** numberOfPayments - 1;

    return principle * (numerator / denominator);
  }

  private calculateTotalPayments({ numberOfPayments }: AmortizationParams, payment: number): number {
    return payment * numberOfPayments;
  }

  private getCacheString({
    principle,
    periodInterestRate,
    numberOfPayments,
  }: AmortizationParams): AmortizationPaymentCacheKey {
    return `principle:${principle};interest-rate:${periodInterestRate};number-of-payments:${numberOfPayments}`;
  }

  private static validatePositiveInteger(str: string): boolean {
    const parsed = Number(str);

    return !Number.isNaN(parsed) && Number.isSafeInteger(parsed) && parsed > 0;
  }

  private static validateFractional(str: string): boolean {
    const parsed = Number(str);

    return !Number.isNaN(parsed) && Number.isFinite(parsed) && parsed <= 100 && parsed > 0;
  }

  private static validatePositive(str: string): boolean {
    const parsed = Number(str);

    return !Number.isNaN(parsed) && Number.isFinite(parsed) && parsed > 0;
  }
}

/**
 *  An amortization calculator that uses the standard amortization formula
 *  where interest is calculated on the remaining balance and principal
 *  payment is the difference between the fixed payment and interest
 */
export class StandardAmortizationCalculator extends AmortizationCalculator {
  getNth(params: AmortizationParams, paymentIndex: number): GetNthResult {
    const { payment, totalPayments } = this.getPayment(params);

    const { principle, periodInterestRate, numberOfPayments } = params;

    if (periodInterestRate === 0) {
      const principlePayment = principle / numberOfPayments;
      const remainingBalance = principle - principlePayment * paymentIndex;

      return {
        payment,
        totalPayments,
        remainingBalance: Math.max(0, remainingBalance),
        interestPayment: 0,
        principlePayment,
        paymentIndex,
      };
    }

    const r = 1 + periodInterestRate;

    const balanceBeforePayment =
      principle * r ** (paymentIndex - 1) - payment * ((r ** (paymentIndex - 1) - 1) / periodInterestRate);

    const interestPayment = balanceBeforePayment * periodInterestRate;

    const principlePayment = payment - interestPayment;

    const remainingBalance = balanceBeforePayment - principlePayment;

    return {
      payment,
      totalPayments,
      remainingBalance,
      interestPayment,
      principlePayment,
      paymentIndex,
    };
  }
}
