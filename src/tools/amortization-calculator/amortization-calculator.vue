<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { AmortizationCalculator, StandardAmortizationCalculator } from './amortization-calculator.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

const { t, locale } = useI18n();

const amortizationCalculator = ref(new StandardAmortizationCalculator());

const currencyDisplayNames = computed(() => new Intl.DisplayNames(locale.value, { type: 'currency' }));

const historicalCodes = [
  'AFA',
  'FIM',
  'ALK',
  'ADP',
  'ESP',
  'FRF',
  'AOK',
  'AON',
  'AOR',
  'ARA',
  'ARP',
  'ARY',
  'RUR',
  'ATS',
  'AYM',
  'AZM',
  'RUR',
  'BYB',
  'BYR',
  'RUR',
  'BEC',
  'BEF',
  'BEL',
  'BOP',
  'BAD',
  'BRB',
  'BRC',
  'BRE',
  'BRN',
  'BRR',
  'BGJ',
  'BGK',
  'BGL',
  'BGN',
  'BUK',
  'HRD',
  'HRK',
  'HRK',
  'CUC',
  'ANG',
  'CYP',
  'CSJ',
  'CSK',
  'ECS',
  'ECV',
  'GQE',
  'EEK',
  'XEU',
  'FIM',
  'FRF',
  'FRF',
  'FRF',
  'GEK',
  'RUR',
  'DDM',
  'DEM',
  'GHC',
  'GHP',
  'GRD',
  'FRF',
  'GNE',
  'GNS',
  'GWE',
  'GWP',
  'ITL',
  'ISJ',
  'IEP',
  'ILP',
  'ILR',
  'ITL',
  'RUR',
  'RUR',
  'LAJ',
  'LVL',
  'LVR',
  'LSM',
  'ZAL',
  'LTL',
  'LTT',
  'LUC',
  'LUF',
  'LUL',
  'MGF',
  'MWK',
  'MVQ',
  'MLF',
  'MTL',
  'MTP',
  'FRF',
  'MRO',
  'FRF',
  'MXP',
  'RUR',
  'FRF',
  'MZE',
  'MZM',
  'NLG',
  'ANG',
  'NIC',
  'PEH',
  'PEI',
  'PEN',
  'PES',
  'PLZ',
  'PTE',
  'FRF',
  'ROK',
  'ROL',
  'RON',
  'RUR',
  'FRF',
  'FRF',
  'FRF',
  'ITL',
  'STD',
  'CSD',
  'EUR',
  'SLL',
  'ANG',
  'SKK',
  'SIT',
  'ZAL',
  'SDG',
  'RHD',
  'ESA',
  'ESB',
  'ESP',
  'SDD',
  'SDP',
  'SRG',
  'SZL',
  'CHC',
  'RUR',
  'TJR',
  'IDR',
  'TPE',
  'TRL',
  'TRY',
  'RUR',
  'TMM',
  'UGS',
  'UGW',
  'UAK',
  'SUR',
  'USS',
  'UYN',
  'UYP',
  'RUR',
  'VEB',
  'VEF',
  'VEF',
  'VEF',
  'VNC',
  'YDD',
  'YUD',
  'YUM',
  'YUN',
  'ZRN',
  'ZRZ',
  'ZMK',
  'ZWC',
  'ZWD',
  'ZWD',
  'ZWN',
  'ZWR',
  'ZWL',
  'XFO',
  'XRE',
  'XFU',
];

const supportedCurrencies = ref(
  Intl.supportedValuesOf('currency')
    .filter((value) => !historicalCodes.includes(value))
    .map((value) => ({
      value,
      label: currencyDisplayNames.value.of(value) ?? value,
    })),
);

const selectedCurrency = useQueryParamOrStorage({
  name: 'selectedCurrency',
  storageName: 'amortization-calculator:selectedCurrency',
  defaultValue: 'USD',
});

const loanAmount = useQueryParamOrStorage({
  name: 'amount',
  storageName: 'amortization-calculator:amount',
  defaultValue: '200000',
});
const loanAmountValidation = useValidation({
  source: loanAmount,
  rules: [
    {
      message: t('tools.amortization-calculator.texts.message-loan-amount-must-be-positive'),
      validator: AmortizationCalculator.validateLoanAmount,
    },
  ],
});
const parsedLoanAmount = computed(() => Number(loanAmount.value));

const loanMonths = useQueryParamOrStorage({
  name: 'months',
  storageName: 'amortization-calculator:months',
  defaultValue: '360',
});
const loanMonthsValidation = useValidation({
  source: loanMonths,
  rules: [
    {
      message: t('tools.amortization-calculator.texts.message-loan-term-must-be-positive-integer'),
      validator: AmortizationCalculator.validateLoanMonths,
    },
  ],
});
const parsedLoanMonths = computed(() => Number(loanMonths.value));

const interestRate = useQueryParamOrStorage({
  name: 'interestRate',
  storageName: 'amortization-calculator:interestRate',
  defaultValue: '6',
});
const interestRateValidation = useValidation({
  source: interestRate,
  rules: [
    {
      message: t('tools.amortization-calculator.texts.message-interest-rate-must-be-between-1-and-100'),
      validator: AmortizationCalculator.validateInterestRate,
    },
  ],
});
const parsedInterestRate = computed(() => Number(interestRate.value));

const allValid = computed(
  () => interestRateValidation.isValid && loanMonthsValidation.isValid && loanAmountValidation.isValid,
);

const payment = computed(() =>
  amortizationCalculator.value.getPayment({
    principal: parsedLoanAmount.value,
    periodInterestRate: parsedInterestRate.value / 1200,
    numberOfPayments: parsedLoanMonths.value,
  }),
);

const amortizationSchedule = computed(() => {
  // Force re-render on currency changes
  // i.e. redeclare generator
  // eslint-disable-next-line no-unused-expressions
  selectedCurrency.value;
  return amortizationCalculator.value.getAmortizationSchedule({
    principal: parsedLoanAmount.value,
    periodInterestRate: parsedInterestRate.value / 1200,
    numberOfPayments: parsedLoanMonths.value,
  });
});

function formatCurrency(num: number): string {
  return num.toLocaleString(undefined, {
    style: 'currency',
    currency: selectedCurrency.value,
    // "negative" is a valid value for signDisplay and supported by all major browsers:
    // https://caniuse.com/mdn-javascript_builtins_intl_numberformat_numberformat_options_parameter_options_signdisplay_parameter_negative
    signDisplay: 'negative' as any,
  });
}
</script>

<template>
  <c-card :title="t('tools.amortization-calculator.texts.title-loan-parameters')" mb-5>
    <c-input-text
      v-model:value="loanAmount"
      placeholder="e.g. 200000"
      :label="t('tools.amortization-calculator.texts.label-loan-amount')"
      raw-text
      mb-5
      :validation="loanAmountValidation"
    />

    <c-input-text
      v-model:value="loanMonths"
      placeholder="e.g. 360"
      :label="t('tools.amortization-calculator.texts.label-loan-term')"
      raw-text
      mb-5
      :validation="loanMonthsValidation"
    />

    <c-input-text
      v-model:value="interestRate"
      placeholder="e.g. 6.0"
      :label="t('tools.amortization-calculator.texts.label-interest-rate')"
      raw-text
      mb-5
      :validation="interestRateValidation"
    />

    <c-select
      v-model:value="selectedCurrency"
      :options="supportedCurrencies"
      :label="t('tools.amortization-calculator.texts.label-displayed-currency')"
      mb-5
    />
  </c-card>

  <div v-if="allValid">
    <n-table mb-5>
      <thead>
        <tr>
          <th>{{ t('tools.amortization-calculator.texts.label-monthly-payment') }}</th>
          <th>{{ t('tools.amortization-calculator.texts.label-total-of-payments') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ formatCurrency(payment.payment) }}
          </td>
          <td>
            {{ formatCurrency(payment.totalPayments) }}
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-table>
      <thead>
        <tr>
          <th>{{ t('tools.amortization-calculator.texts.label-month') }}</th>
          <th>{{ t('tools.amortization-calculator.texts.label-interest') }}</th>
          <th>{{ t('tools.amortization-calculator.texts.label-principal') }}</th>
          <th>{{ t('tools.amortization-calculator.texts.label-ending-balance') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="period in amortizationSchedule" :key="period.type + period.paymentIndex">
          <template v-if="period.type === 'month'">
            <td>{{ period.paymentIndex }}</td>
            <td>{{ formatCurrency(period.interestPayment) }}</td>
            <td>{{ formatCurrency(period.principalPayment) }}</td>
            <td>{{ formatCurrency(period.remainingBalance) }}</td>
          </template>
          <template v-else>
            <th>{{ t('tools.amortization-calculator.texts.label-end-of-year', { year: period.paymentIndex }) }}</th>
            <th>{{ formatCurrency(period.interestPayment) }}</th>
            <th>{{ formatCurrency(period.principalPayment) }}</th>
            <th>{{ formatCurrency(period.remainingBalance) }}</th>
          </template>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
