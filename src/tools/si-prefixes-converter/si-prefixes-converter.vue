<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Big from 'big.js';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

interface Prefix {
  label: string
  symbol: string
  exponent: number
};

const prefixes: Prefix[] = [
  { label: t('tools.si-prefixes-converter.texts.label-quetta-q'), symbol: 'Q', exponent: 30 },
  { label: t('tools.si-prefixes-converter.texts.label-ronna-r'), symbol: 'R', exponent: 27 },
  { label: t('tools.si-prefixes-converter.texts.label-yotta-y'), symbol: 'Y', exponent: 24 },
  { label: t('tools.si-prefixes-converter.texts.label-zetta-z'), symbol: 'Z', exponent: 21 },
  { label: t('tools.si-prefixes-converter.texts.label-exa-e'), symbol: 'E', exponent: 18 },
  { label: t('tools.si-prefixes-converter.texts.label-peta-p'), symbol: 'P', exponent: 15 },
  { label: t('tools.si-prefixes-converter.texts.label-tera-t'), symbol: 'T', exponent: 12 },
  { label: t('tools.si-prefixes-converter.texts.label-giga-g'), symbol: 'G', exponent: 9 },
  { label: t('tools.si-prefixes-converter.texts.label-mega-m'), symbol: 'M', exponent: 6 },
  { label: t('tools.si-prefixes-converter.texts.label-kilo-k'), symbol: 'k', exponent: 3 },
  { label: t('tools.si-prefixes-converter.texts.label-hecto-h'), symbol: 'h', exponent: 2 },
  { label: t('tools.si-prefixes-converter.texts.label-deca-da'), symbol: 'da', exponent: 1 },
  { label: t('tools.si-prefixes-converter.texts.label-unit'), symbol: '0', exponent: 0 },
  { label: t('tools.si-prefixes-converter.texts.label-deci-d'), symbol: 'd', exponent: -1 },
  { label: t('tools.si-prefixes-converter.texts.label-centi-c'), symbol: 'c', exponent: -2 },
  { label: t('tools.si-prefixes-converter.texts.label-milli-m'), symbol: 'm', exponent: -3 },
  { label: t('tools.si-prefixes-converter.texts.label-micro-µ'), symbol: 'µ', exponent: -6 },
  { label: t('tools.si-prefixes-converter.texts.label-nano-n'), symbol: 'n', exponent: -9 },
  { label: t('tools.si-prefixes-converter.texts.label-pico-p'), symbol: 'p', exponent: -12 },
  { label: t('tools.si-prefixes-converter.texts.label-femto-f'), symbol: 'f', exponent: -15 },
  { label: t('tools.si-prefixes-converter.texts.label-atto-a'), symbol: 'a', exponent: -18 },
  { label: t('tools.si-prefixes-converter.texts.label-zepto-z'), symbol: 'z', exponent: -21 },
  { label: t('tools.si-prefixes-converter.texts.label-yocto-y'), symbol: 'y', exponent: -24 },
  { label: t('tools.si-prefixes-converter.texts.label-ronto-r'), symbol: 'r', exponent: -27 },
  { label: t('tools.si-prefixes-converter.texts.label-quecto-q'), symbol: 'q', exponent: -30 },
];

const prefixOptions = prefixes.map(p => ({
  label: p.label,
  value: p.symbol,
}));

const fromSymbol = useQueryParamOrStorage({ storageName: 'si-pref-conv:f', name: 'from', defaultValue: 'q' });
const toSymbol = useQueryParamOrStorage({ storageName: 'si-pref-conv:t', name: 'to', defaultValue: 'Q' });
const formatMode = useQueryParamOrStorage<'auto' | 'fixed' | 'exp'>({ storageName: 'si-pref-conv:m', name: 'mode', defaultValue: 'auto' });
const decimals = useQueryParamOrStorage({ storageName: 'si-pref-conv:d', name: 'dec', defaultValue: 6 });
const thousandSep = useQueryParamOrStorage({ storageName: 'si-pref-conv:s', name: 'sep', defaultValue: true });

const inputValue = ref<number | null>(1);

const fromPrefix = computed(() => prefixes.find(p => p.symbol === fromSymbol.value)!);
const toPrefix = computed(() => prefixes.find(p => p.symbol === toSymbol.value)!);

// Conversion
const converted = computed(() => {
  if (inputValue.value === null) {
    return null;
  }
  const delta = fromPrefix.value.exponent - toPrefix.value.exponent;
  return new Big(inputValue.value).times(new Big(10).pow(delta));
});

// Formatting pipeline
function formatValue(v: Big): string {
  if (formatMode.value === 'exp') {
    return v.toExponential(decimals.value);
  }

  if (formatMode.value === 'fixed') {
    const fixed = v.toFixed(decimals.value);
    return thousandSep.value ? addThousandSep(fixed) : fixed;
  }

  // AUTO mode
  const abs = v.abs();
  if (abs.gte('1e6') || abs.lte('1e-4')) {
    return v.toExponential(decimals.value);
  }

  const normal = v.toFixed(decimals.value);
  return thousandSep.value ? addThousandSep(normal) : normal;
}

function addThousandSep(str: string): string {
  const [int, dec] = str.split('.');
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return dec ? `${withSep}.${dec}` : withSep;
}

const displayValue = computed(() => {
  if (!converted.value) {
    return '';
  }
  return formatValue(converted.value);
});
</script>

<template>
  <div>
    <NSpace justify="center" wrap>
      <NFormItem :label="t('tools.si-prefixes-converter.texts.label-convert')" label-placement="left">
        <n-input-number-i18n v-model:value="inputValue" mr-1 />
        <NSelect
          v-model:value="fromSymbol"
          :options="prefixOptions"
          style="width: 200px"
          filterable
        />
      </NFormItem>
    </NSpace>

    <NSpace justify="center">
      <NFormItem :label="t('tools.si-prefixes-converter.texts.label-mode')" label-placement="left">
        <NSelect
          v-model:value="formatMode"
          :options="[
            { label: t('tools.si-prefixes-converter.texts.label-auto'), value: 'auto' },
            { label: t('tools.si-prefixes-converter.texts.label-fixed'), value: 'fixed' },
            { label: t('tools.si-prefixes-converter.texts.label-exponential'), value: 'exp' },
          ]"
          style="width: 200px"
          filterable
        />
      </NFormItem>
      <NFormItem :label="t('tools.si-prefixes-converter.texts.label-decimals')" label-placement="left">
        <NInputNumber v-model:value="decimals" :min="0" :max="60" style="width: 200px" />
      </NFormItem>
      <NFormItem :label="t('tools.si-prefixes-converter.texts.label-thousand-separators')" label-placement="left">
        <NSwitch v-model:value="thousandSep" />
      </NFormItem>
    </NSpace>

    <NSpace justify="center" align="center" wrap>
      <NFormItem :label="t('tools.si-prefixes-converter.texts.label-to')" label-placement="left">
        <NSelect v-model:value="toSymbol" :options="prefixOptions" style="width: 200px" mr-1 />
        <NText mr-1>
          {{ t('tools.si-prefixes-converter.texts.tag-') }}
        </NText>
        <input-copyable :value="displayValue" autosize style="width: 400px" />
      </NFormItem>
    </NSpace>
  </div>
</template>
