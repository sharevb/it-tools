<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';

const inputValue = ref(16);
const baseFontSize = ref(16);
const viewportWidth = useQueryParamOrStorage({ name: 'vw', storageName: 'css-units-conv:w', defaultValue: 1440 });
const viewportHeight = useQueryParamOrStorage({ name: 'vh', storageName: 'css-units-conv:h', defaultValue: 900 });
const fromUnit = useQueryParamOrStorage({ name: 'from', storageName: 'css-units-conv:f', defaultValue: 'px' });
const toUnit = useQueryParamOrStorage({ name: 'to', storageName: 'css-units-conv:t', defaultValue: 'em' });

const unitOptions = [
  { label: 'Pixels (px)', value: 'px' },
  { label: 'Ems (em)', value: 'em' },
  { label: 'Rems (rem)', value: 'rem' },
  { label: 'Percent (%)', value: '%' },
  { label: 'Viewport Width (vw)', value: 'vw' },
  { label: 'Viewport Height (vh)', value: 'vh' },
];

const usesRelativeUnits = computed(() =>
  ['em', 'rem', '%'].includes(fromUnit.value) || ['em', 'rem', '%'].includes(toUnit.value),
);

const usesViewportUnits = computed(() =>
  ['vw', 'vh'].includes(fromUnit.value) || ['vw', 'vh'].includes(toUnit.value),
);

function toPx(value: number, unit: string) {
  switch (unit) {
    case 'px': return value;
    case 'em':
    case 'rem': return value * baseFontSize.value;
    case '%': return (value / 100) * baseFontSize.value;
    case 'vw': return (value / 100) * viewportWidth.value;
    case 'vh': return (value / 100) * viewportHeight.value;
    default: return value;
  }
}

function fromPx(pxValue: number, unit: string) {
  switch (unit) {
    case 'px': return pxValue;
    case 'em':
    case 'rem': return pxValue / baseFontSize.value;
    case '%': return (pxValue / baseFontSize.value) * 100;
    case 'vw': return (pxValue / viewportWidth.value) * 100;
    case 'vh': return (pxValue / viewportHeight.value) * 100;
    default: return pxValue;
  }
}

const convertedValue = computed(() => {
  const px = toPx(inputValue.value, fromUnit.value);
  return fromPx(px, toUnit.value).toFixed(2);
});
</script>

<template>
  <div>
    <NForm label-placement="left">
      <n-space justify="center">
        <NFormItem label="Value to convert:">
          <NInputNumber v-model:value="inputValue" />
        </NFormItem>

        <NFormItem label="From Unit:">
          <NSelect v-model:value="fromUnit" :options="unitOptions" style="width: 200px" />
        </NFormItem>

        <NFormItem label="To Unit:">
          <NSelect v-model:value="toUnit" :options="unitOptions" style="width: 200px" />
        </NFormItem>
      </n-space>

      <n-space justify="center">
        <NFormItem v-if="usesRelativeUnits" label="Base Font Size (px)">
          <NInputNumber v-model:value="baseFontSize" :min="1" />
        </NFormItem>

        <NFormItem v-if="usesViewportUnits" label="Viewport Width (px)">
          <NInputNumber v-model:value="viewportWidth" :min="1" />
        </NFormItem>

        <NFormItem v-if="usesViewportUnits" label="Viewport Height (px)">
          <NInputNumber v-model:value="viewportHeight" :min="1" />
        </NFormItem>
      </n-space>

      <c-card title="Conversion">
        <n-p>
          {{ inputValue }}{{ fromUnit }} = {{ convertedValue }}{{ toUnit }}
          <span v-if="usesRelativeUnits">(for base font size of {{ baseFontSize }}px)</span>
          <span v-if="usesViewportUnits">(for viewport of {{ viewportWidth }}x{{ viewportHeight }})</span>
        </n-p>
        <input-copyable label="Converted value:" label-position="left" :value="convertedValue" />
      </c-card>
    </NForm>
  </div>
</template>
