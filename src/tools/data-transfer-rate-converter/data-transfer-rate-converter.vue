<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDuration, intervalToDuration } from 'date-fns';
import { type AllSupportedUnits, displayStorageAndRateUnits } from '../data-storage-unit-converter/data-storage-unit-converter.service';
import { amountTransferable, transferSpeedRate, transferTimeSeconds } from './data-transfer-rate-converter.service';

const { t } = useI18n();

const allStorateUnits = [
  { value: 'B', label: t('tools.data-transfer-rate-converter.texts.label-bytes-b') },
  { value: 'iB', label: t('tools.data-transfer-rate-converter.texts.label-bibytes-ib') },
  { value: 'KB', label: t('tools.data-transfer-rate-converter.texts.label-kilobytes-kb') },
  { value: 'KiB', label: t('tools.data-transfer-rate-converter.texts.label-kibibytes-kib') },
  { value: 'MB', label: t('tools.data-transfer-rate-converter.texts.label-megabytes-mb') },
  { value: 'MiB', label: t('tools.data-transfer-rate-converter.texts.label-mebibytes-mib') },
  { value: 'GB', label: t('tools.data-transfer-rate-converter.texts.label-gigabytes-gb') },
  { value: 'GiB', label: t('tools.data-transfer-rate-converter.texts.label-gibibytes-gib') },
  { value: 'TB', label: t('tools.data-transfer-rate-converter.texts.label-terabytes-tb') },
  { value: 'TiB', label: t('tools.data-transfer-rate-converter.texts.label-tebibytes-tib') },
  { value: 'PB', label: t('tools.data-transfer-rate-converter.texts.label-petabytes-pb') },
  { value: 'PiB', label: t('tools.data-transfer-rate-converter.texts.label-pebibytes-pib') },
  { value: 'EB', label: t('tools.data-transfer-rate-converter.texts.label-exabytes-eb') },
  { value: 'EiB', label: t('tools.data-transfer-rate-converter.texts.label-exbibytes-eib') },
  { value: 'ZB', label: t('tools.data-transfer-rate-converter.texts.label-zettabytes-zb') },
  { value: 'ZiB', label: t('tools.data-transfer-rate-converter.texts.label-zebibytes-zib') },
  { value: 'YB', label: t('tools.data-transfer-rate-converter.texts.label-yottabytes-yb') },
  { value: 'YiB', label: t('tools.data-transfer-rate-converter.texts.label-yobibytes-yib') },
];
const allBitsUnits = [
  { value: 'b', label: t('tools.data-transfer-rate-converter.texts.label-bits-bit') },
  { value: 'Kb', label: t('tools.data-transfer-rate-converter.texts.label-kilobits-kbit') },
  { value: 'Mb', label: t('tools.data-transfer-rate-converter.texts.label-megabits-mbit') },
  { value: 'Gb', label: t('tools.data-transfer-rate-converter.texts.label-gigabits-gbit') },
  { value: 'Tb', label: t('tools.data-transfer-rate-converter.texts.label-terabits-tbit') },
  { value: 'Pb', label: t('tools.data-transfer-rate-converter.texts.label-petabits-pbit') },
  { value: 'Eb', label: t('tools.data-transfer-rate-converter.texts.label-exabits-ebit') },
  { value: 'Zb', label: t('tools.data-transfer-rate-converter.texts.label-zettabits-zbit') },
  { value: 'Yb', label: t('tools.data-transfer-rate-converter.texts.label-yottabits-ybit') },
];

const allRateUnits = [...allBitsUnits, ...allStorateUnits];

function convertToTimeDisplay(seconds: number) {
  if (seconds === 0) {
    return '0';
  }
  return formatDuration(intervalToDuration({ start: 0, end: seconds * 1000 }));
}

const transferTimeInput = ref<{
  dataSize: string
  dataSizeUnit: string
  bitRate: string
  bitRateUnit: string
}>({
  dataSize: '0',
  dataSizeUnit: 'MB',
  bitRate: '1',
  bitRateUnit: 'Mb',
});
const transferTimeOutput = computed(() => {
  try {
    return convertToTimeDisplay(transferTimeSeconds({
      dataSize: Number(transferTimeInput.value.dataSize),
      dataSizeUnit: transferTimeInput.value.dataSizeUnit as AllSupportedUnits,
      bitRate: Number(transferTimeInput.value.bitRate),
      bitRateUnit: transferTimeInput.value.bitRateUnit as AllSupportedUnits,
    }));
  }
  catch (e: any) {
    return e.toString();
  }
});

const transferSpeedRateInput = ref<{
  dataSize: string
  dataSizeUnit: string
  hours: number
  minutes: number
  seconds: number
  bitRateUnit: string
}>({
  dataSize: '0',
  dataSizeUnit: 'GB',
  hours: 0,
  minutes: 0,
  seconds: 0,
  bitRateUnit: 'Mb',
});
const transferSpeedRateOutput = computed(() => {
  try {
    return displayStorageAndRateUnits({
      unit: transferSpeedRateInput.value.bitRateUnit as AllSupportedUnits,
      appendUnit: true,
      value: transferSpeedRate({
        dataSize: Number(transferSpeedRateInput.value.dataSize),
        dataSizeUnit: transferSpeedRateInput.value.dataSizeUnit as AllSupportedUnits,
        hours: transferSpeedRateInput.value.hours,
        minutes: transferSpeedRateInput.value.minutes,
        seconds: transferSpeedRateInput.value.seconds,
        bitRateUnit: transferSpeedRateInput.value.bitRateUnit as AllSupportedUnits,
      }),
    });
  }
  catch (e: any) {
    return e.toString();
  }
});

const amountTransferableInput = ref<{
  bitRate: string
  bitRateUnit: string
  hours: number
  minutes: number
  seconds: number
  dataSizeUnit: string
}>({
  bitRate: '0',
  bitRateUnit: 'Mb',
  hours: 0,
  minutes: 0,
  seconds: 0,
  dataSizeUnit: 'MB',
});
const amountTransferableOutput = computed(() => {
  try {
    return displayStorageAndRateUnits({
      unit: amountTransferableInput.value.dataSizeUnit as AllSupportedUnits,
      appendUnit: true,
      value: amountTransferable({
        bitRate: Number(amountTransferableInput.value.bitRate),
        bitRateUnit: amountTransferableInput.value.bitRateUnit as AllSupportedUnits,
        hours: amountTransferableInput.value.hours,
        minutes: amountTransferableInput.value.minutes,
        seconds: amountTransferableInput.value.seconds,
        dataSizeUnit: amountTransferableInput.value.dataSizeUnit as AllSupportedUnits,
      }),
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
      {{ t('tools.data-transfer-rate-converter.texts.tag-1mib-1024kib-1mb-1000kb-1gib-1024mib-1gb-1000mb') }}<n-a href="https://en.wikipedia.org/wiki/Byte" target="_blank" rel="noopener">
        {{ t('tools.data-transfer-rate-converter.texts.tag-see-here-for-details') }}
      </n-a>
    </n-p>

    <c-card :title="t('tools.data-transfer-rate-converter.texts.title-transfer-time')" mb-2>
      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-data-size')" label-placement="left">
        <n-input v-model:value="transferTimeInput.dataSize" :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-data-size')" :min="0" w-full />
        <c-select
          v-model:value="transferTimeInput.dataSizeUnit"
          searchable
          :options="allStorateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-storage-unit')"
          ml-1
        />
      </n-form-item>

      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-bit-rate')" label-placement="left">
        <n-input v-model:value="transferTimeInput.bitRate" :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-bit-rate')" :min="0" w-full />
        <c-select
          v-model:value="transferTimeInput.bitRateUnit"
          searchable
          :options="allRateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-bit-rate-unit')"
          ml-1
        />
      </n-form-item>

      <n-divider />

      <InputCopyable
        :label="t('tools.data-transfer-rate-converter.texts.label-transfer-time')"
        :value="transferTimeOutput"
        :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-transfer-time-will-be-here')"
      />
    </c-card>
    <c-card :title="t('tools.data-transfer-rate-converter.texts.title-transfer-bit-rate-speed')" mb-2>
      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-data-size')" label-placement="left">
        <n-input v-model:value="transferSpeedRateInput.dataSize" :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-data-size')" :min="0" w-full />
        <c-select
          v-model:value="transferSpeedRateInput.dataSizeUnit"
          :options="allStorateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-storage-unit')"
          ml-1
        />
      </n-form-item>

      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-duration-h-m-s')" label-placement="left">
        <n-input-number v-model:value="transferSpeedRateInput.hours" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-hours')" :min="0" w-full />
        <n-input-number v-model:value="transferSpeedRateInput.minutes" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-minutes')" :min="0" w-full />
        <n-input-number v-model:value="transferSpeedRateInput.seconds" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-seconds')" :min="0" w-full />
      </n-form-item>

      <n-divider />

      <div flex items-baseline gap-2>
        <InputCopyable
          :label="t('tools.data-transfer-rate-converter.texts.label-transfer-bit-rate-speed')"
          label-position="left"
          :value="transferSpeedRateOutput"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-bit-rate-will-be-here')"
        />
        <c-select
          v-model:value="transferSpeedRateInput.bitRateUnit"
          :options="allRateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-bit-rate-unit')"
          ml-1
        />
      </div>
    </c-card>
    <c-card :title="t('tools.data-transfer-rate-converter.texts.title-amount-transferable')" mb-2>
      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-bit-rate')" label-placement="left">
        <n-input v-model:value="amountTransferableInput.bitRate" :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-bit-rate')" :min="0" w-full />
        <c-select
          v-model:value="amountTransferableInput.bitRateUnit"
          :options="allRateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-bit-rate-unit')"
          ml-1
        />
      </n-form-item>

      <n-form-item :label="t('tools.data-transfer-rate-converter.texts.label-duration-h-m-s')" label-placement="left">
        <n-input-number v-model:value="amountTransferableInput.hours" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-hours')" :min="0" w-full />
        <n-input-number v-model:value="amountTransferableInput.minutes" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-minutes')" :min="0" w-full />
        <n-input-number v-model:value="amountTransferableInput.seconds" mr-1 :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-seconds')" :min="0" w-full />
      </n-form-item>

      <n-divider />

      <div flex items-baseline gap-2>
        <InputCopyable
          :label="t('tools.data-transfer-rate-converter.texts.label-amount-transferable')"
          label-position="left"
          :value="amountTransferableOutput"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-amount-transferable-will-be-here')"
        />
        <c-select
          v-model:value="amountTransferableInput.dataSizeUnit"
          searchable
          :options="allStorateUnits"
          :placeholder="t('tools.data-transfer-rate-converter.texts.placeholder-select-a-storage-unit')"
          ml-1
        />
      </div>
    </c-card>
  </div>
</template>
