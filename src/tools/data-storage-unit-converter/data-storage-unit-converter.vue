<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import { type AllSupportedUnits, convertStorageAndRateUnitsDisplay } from './data-storage-unit-converter.service';

const { t } = useI18n();

const input = ref<{ size: string; unit: string }>({ size: '0', unit: 'KB' });
const output = ref<{ unit: string; precision: number; appendUnit: boolean }>({ unit: 'MB', precision: 3, appendUnit: false });

const allUnits = [
  { value: 'B', label: t('tools.data-storage-unit-converter.texts.label-bytes-b') },
  { value: 'b', label: t('tools.data-storage-unit-converter.texts.label-bits-bit') },
  { value: 'iB', label: t('tools.data-storage-unit-converter.texts.label-bibytes-ib') },
  { value: 'KB', label: t('tools.data-storage-unit-converter.texts.label-kilobytes-kb') },
  { value: 'Kb', label: t('tools.data-storage-unit-converter.texts.label-kilobits-kbit') },
  { value: 'KiB', label: t('tools.data-storage-unit-converter.texts.label-kibibytes-kib') },
  { value: 'MB', label: t('tools.data-storage-unit-converter.texts.label-megabytes-mb') },
  { value: 'Mb', label: t('tools.data-storage-unit-converter.texts.label-megabits-mbit') },
  { value: 'MiB', label: t('tools.data-storage-unit-converter.texts.label-mebibytes-mib') },
  { value: 'GB', label: t('tools.data-storage-unit-converter.texts.label-gigabytes-gb') },
  { value: 'Gb', label: t('tools.data-storage-unit-converter.texts.label-gigabits-gbit') },
  { value: 'GiB', label: t('tools.data-storage-unit-converter.texts.label-gibibytes-gib') },
  { value: 'TB', label: t('tools.data-storage-unit-converter.texts.label-terabytes-tb') },
  { value: 'Tb', label: t('tools.data-storage-unit-converter.texts.label-terabits-tbit') },
  { value: 'TiB', label: t('tools.data-storage-unit-converter.texts.label-tebibytes-tib') },
  { value: 'PB', label: t('tools.data-storage-unit-converter.texts.label-petabytes-pb') },
  { value: 'Pb', label: t('tools.data-storage-unit-converter.texts.label-petabits-pbit') },
  { value: 'PiB', label: t('tools.data-storage-unit-converter.texts.label-pebibytes-pib') },
  { value: 'EB', label: t('tools.data-storage-unit-converter.texts.label-exabytes-eb') },
  { value: 'Eb', label: t('tools.data-storage-unit-converter.texts.label-exabits-ebit') },
  { value: 'EiB', label: t('tools.data-storage-unit-converter.texts.label-exbibytes-eib') },
  { value: 'ZB', label: t('tools.data-storage-unit-converter.texts.label-zettabytes-zb') },
  { value: 'Zb', label: t('tools.data-storage-unit-converter.texts.label-zettabits-zbit') },
  { value: 'ZiB', label: t('tools.data-storage-unit-converter.texts.label-zebibytes-zib') },
  { value: 'YB', label: t('tools.data-storage-unit-converter.texts.label-yottabytes-yb') },
  { value: 'Yb', label: t('tools.data-storage-unit-converter.texts.label-yottabits-ybit') },
  { value: 'YiB', label: t('tools.data-storage-unit-converter.texts.label-yobibytes-yib') },
];

const convertedValue = computed(() => {
  try {
    return convertStorageAndRateUnitsDisplay({
      value: Number(input.value.size),
      fromUnit: input.value.unit as AllSupportedUnits,
      toUnit: output.value.unit as AllSupportedUnits,
      precision: output.value.precision,
      appendUnit: output.value.appendUnit,
    });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-p text-center>
      {{ t('tools.data-storage-unit-converter.texts.tag-1mib-1024kib-1mb-1000kb-1gib-1024mib-1gb-1000mb') }}<n-a href="https://en.wikipedia.org/wiki/Byte" target="_blank" rel="noopener">
        {{ t('tools.data-storage-unit-converter.texts.tag-see-here-for-details') }}
      </n-a>
    </n-p>

    <c-card>
      <n-form-item :label="t('tools.data-storage-unit-converter.texts.label-input-size')" label-placement="left" mb-1>
        <c-input-text
          v-model:value="input.size"
          :placeholder="t('tools.data-storage-unit-converter.texts.placeholder-put-your-number-here-ex-1024')"
          mr-2
        />
        <c-select
          v-model:value="input.unit"
          :options="allUnits"
          :placeholder="t('tools.data-storage-unit-converter.texts.placeholder-select-input-unit')"
        />
      </n-form-item>

      <div flex items-baseline gap-2>
        <c-select
          v-model:value="output.unit"
          :label="t('tools.data-storage-unit-converter.texts.label-output')" label-position="left"
          :options="allUnits"
          :placeholder="t('tools.data-storage-unit-converter.texts.placeholder-select-output-unit')"
        />

        <n-form-item :label="t('tools.data-storage-unit-converter.texts.label-precision')" label-placement="left">
          <n-input-number-i18n v-model:value="output.precision" style="width:100px" :placeholder="t('tools.data-storage-unit-converter.texts.placeholder-precision')" :max="10" :min="0" />
        </n-form-item>

        <n-checkbox v-model:checked="output.appendUnit">
          {{ t('tools.data-storage-unit-converter.texts.tag-show-unit') }}
        </n-checkbox>
      </div>

      <n-divider />

      <InputCopyable
        :label="t('tools.data-storage-unit-converter.texts.label-output-value')"
        :value="convertedValue"
        :placeholder="t('tools.data-storage-unit-converter.texts.placeholder-output-value-will-be-here')"
      />
    </c-card>
  </div>
</template>
