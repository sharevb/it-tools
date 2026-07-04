<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { code, countries, country } from 'currency-codes-ts';
import converter from 'currency-exchanger-js';
import moneysData from './moneys.json';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const allCurrencies = Object.entries(moneysData).map(([k, v]) => ({ value: k, label: v || k }));
const otherCurrencies = useQueryParamOrStorage<{ name: string }[]>({ name: 'to', storageName: 'currency-conv:others', defaultValue: [{ name: 'usd' }] });
const currentCurrency = useQueryParamOrStorage<string>({ name: 'from', storageName: 'currency-conv:cur', defaultValue: 'eur' });
const amount = useQueryParam({ tool: 'currency-conv', name: 'amount', defaultValue: 1 });
const currentDatetime = ref(Date.now());

const convertedCurrencies = computedAsync<Record<string, number>>(async () => {
  const currentCurrencyValue = currentCurrency.value;
  const currentDatetimeValue = currentDatetime.value;
  const amountValue = amount.value;
  const otherCurrenciesValues = otherCurrencies.value;

  let result = {};
  for (const targetCurrency of otherCurrenciesValues) {
    const value = await converter.convertOnDate(amountValue, currentCurrencyValue, targetCurrency.name, new Date(currentDatetimeValue));
    result = { ...result, [targetCurrency.name]: value };
  }
  return result;
});

const countryToCurrenciesInput = ref('France');
const allCountries = countries();
const countryToCurrenciesOutput = computed(() => country(countryToCurrenciesInput.value));

const currencyToCountriesInput = ref('eur');
const currencyToCountriesOutput = computed(() => code(currencyToCountriesInput.value));
</script>

<template>
  <div>
    <c-card :title="t('tools.currency-converter.texts.title-currency-converter')" mb-2>
      <c-select
        v-model:value="currentCurrency"
        :label="t('tools.currency-converter.texts.label-from')"
        label-position="left"
        searchable
        :options="allCurrencies"
        mb-2
      />
      <n-form-item :label="t('tools.currency-converter.texts.label-amount')" label-placement="left" mb-2>
        <n-input-number-i18n v-model:value="amount" :min="0" />
      </n-form-item>

      <n-form-item :label="t('tools.currency-converter.texts.label-for-date')" label-placement="left" mb-2>
        <n-date-picker
          v-model:value="currentDatetime"
          type="date"
        />
      </n-form-item>

      <c-card :title="t('tools.currency-converter.texts.title-converted-currencies')">
        <n-dynamic-input
          v-model:value="otherCurrencies"
          show-sort-button
          :on-create="() => ({ name: 'eur' })"
        >
          <template #default="{ value }">
            <div flex flex-wrap items-center gap-1>
              <n-select
                v-model:value="value.name"
                filterable
                :placeholder="t('tools.currency-converter.texts.placeholder-please-select-a-currency')"
                :options="allCurrencies"
                w-full
              />
              <input-copyable readonly :value="convertedCurrencies ? convertedCurrencies[value.name] : 0" />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>
    </c-card>

    <c-card :title="t('tools.currency-converter.texts.title-country-to-currencies')" mb-2>
      <c-select
        v-model:value="countryToCurrenciesInput"
        :label="t('tools.currency-converter.texts.label-country')"
        label-position="left"
        searchable
        :options="allCountries"
      />

      <n-divider />

      <ul>
        <li v-for="(currency, ix) in countryToCurrenciesOutput" :key="ix">
          {{ currency.currency }} [{{ currency.code }}/{{ currency.number }} - {{ currency.digits }}digits] (also in: {{ currency.countries?.join(', ') }})
        </li>
      </ul>
    </c-card>

    <c-card :title="t('tools.currency-converter.texts.title-currencies-to-countries')" mb-2>
      <c-select
        v-model:value="currencyToCountriesInput"
        :label="t('tools.currency-converter.texts.label-currency')"
        label-position="left"
        searchable
        :options="allCurrencies"
      />

      <n-divider />

      <n-p v-if="currencyToCountriesOutput">
        {{ currencyToCountriesOutput.currency }} [{{ currencyToCountriesOutput.code }}/{{ currencyToCountriesOutput.number }} - {{ currencyToCountriesOutput.digits }}digits]
      </n-p>

      <ul v-if="currencyToCountriesOutput">
        <li v-for="(countryName, ix) in currencyToCountriesOutput.countries" :key="ix">
          {{ countryName }}
        </li>
      </ul>
    </c-card>
  </div>
</template>
