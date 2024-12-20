<script setup lang="ts">
import { formatDuration, intervalToDuration } from 'date-fns';
import { type AllSupportedUnits, type BitsUnits, displayStorageAndRateUnits } from '../data-storage-unit-converter/data-storage-unit-converter.service';
import { amountTransferable, neededRate, transferTimeSeconds } from './data-transfer-rate-converter.service';

const allStorateUnits = [
  { value: 'B', label: 'Bytes (B)' },
  { value: 'iB', label: 'Bibytes (iB)' },
  { value: 'KB', label: 'Kilobytes (KB)' },
  { value: 'KiB', label: 'Kibibytes (KiB)' },
  { value: 'MB', label: 'Megabytes (MB)' },
  { value: 'MiB', label: 'Mebibytes (MiB)' },
  { value: 'GB', label: 'Gigabytes (GB)' },
  { value: 'GiB', label: 'Gibibytes (GiB)' },
  { value: 'TB', label: 'Terabytes (TB)' },
  { value: 'TiB', label: 'Tebibytes (TiB)' },
  { value: 'PB', label: 'Petabytes (PB)' },
  { value: 'PiB', label: 'Pebibytes (PiB)' },
  { value: 'EB', label: 'Exabytes (EB)' },
  { value: 'EiB', label: 'Exbibytes (EiB)' },
  { value: 'ZB', label: 'Zettabytes (ZB)' },
  { value: 'ZiB', label: 'Zebibytes (ZiB)' },
  { value: 'YB', label: 'Yottabytes (YB)' },
  { value: 'YiB', label: 'Yobibytes (YiB)' },
];
const allBitsUnits = [
  { value: 'b', label: 'Bits (bit)' },
  { value: 'Kb', label: 'Kilobits (Kbit)' },
  { value: 'Mb', label: 'Megabits (Mbit)' },
  { value: 'Gb', label: 'Gigabits (Gbit)' },
  { value: 'Tb', label: 'Terabits (Tbit)' },
  { value: 'Pb', label: 'Petabits (Pbit)' },
  { value: 'Eb', label: 'Exabits (Ebit)' },
  { value: 'Zb', label: 'Zettabits (Zbit)' },
  { value: 'Yb', label: 'Yottabits (Ybit)' },
];

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
      bitRateUnit: transferTimeInput.value.bitRateUnit as BitsUnits,
    }));
  }
  catch (e: any) {
    return e.toString();
  }
});

const neededRateInput = ref<{
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
const neededRateOutput = computed(() => {
  try {
    return displayStorageAndRateUnits({
      unit: neededRateInput.value.bitRateUnit as BitsUnits,
      appendUnit: true,
      value: neededRate({
        dataSize: Number(neededRateInput.value.dataSize),
        dataSizeUnit: neededRateInput.value.dataSizeUnit as AllSupportedUnits,
        hours: neededRateInput.value.hours,
        minutes: neededRateInput.value.minutes,
        seconds: neededRateInput.value.seconds,
        bitRateUnit: neededRateInput.value.bitRateUnit as BitsUnits,
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
        bitRateUnit: amountTransferableInput.value.bitRateUnit as BitsUnits,
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
    <c-card title="Transfer Time" mb-2>
      <n-form-item label="Data Size:" label-placement="left">
        <n-input v-model:value="transferTimeInput.dataSize" placeholder="Data Size..." :min="0" w-full />
        <c-select
          v-model:value="transferTimeInput.dataSizeUnit"
          searchable
          :options="allStorateUnits"
          placeholder="Select a storage unit"
          ml-1
        />
      </n-form-item>

      <n-form-item label="Bit Rate:" label-placement="left">
        <n-input v-model:value="transferTimeInput.bitRate" placeholder="Bit Rate..." :min="0" w-full />
        <c-select
          v-model:value="transferTimeInput.bitRateUnit"
          searchable
          :options="allBitsUnits"
          placeholder="Select a bit rate unit"
          ml-1
        />
      </n-form-item>

      <n-divider />

      <InputCopyable
        label="Transfer time"
        :value="transferTimeOutput"
        placeholder="Transfer time will be here..."
      />
    </c-card>
    <c-card title="Needed Bit Rate" mb-2>
      <n-form-item label="Data Size:" label-placement="left">
        <n-input v-model:value="neededRateInput.dataSize" placeholder="Data Size..." :min="0" w-full />
        <c-select
          v-model:value="neededRateInput.dataSizeUnit"
          :options="allStorateUnits"
          placeholder="Select a storage unit"
          ml-1
        />
      </n-form-item>

      <n-form-item label="Duration (h/m/s):" label-placement="left">
        <n-input-number v-model:value="neededRateInput.hours" mr-1 placeholder="Hours" :min="0" w-full />
        <n-input-number v-model:value="neededRateInput.minutes" mr-1 placeholder="Minutes" :min="0" w-full />
        <n-input-number v-model:value="neededRateInput.seconds" mr-1 placeholder="Seconds" :min="0" w-full />
      </n-form-item>

      <n-divider />

      <div flex items-baseline gap-2>
        <InputCopyable
          label="Needed Bit Rate:"
          label-position="left"
          :value="neededRateOutput"
          placeholder="Needed Bit Rate will be here..."
        />
        <c-select
          v-model:value="transferTimeInput.bitRateUnit"
          :options="allBitsUnits"
          placeholder="Select a bit rate unit"
          ml-1
        />
      </div>
    </c-card>
    <c-card title="Amount Transferable" mb-2>
      <n-form-item label="Bit Rate:" label-placement="left">
        <n-input v-model:value="amountTransferableInput.bitRate" placeholder="Bit Rate..." :min="0" w-full />
        <c-select
          v-model:value="amountTransferableInput.bitRateUnit"
          :options="allBitsUnits"
          placeholder="Select a bit rate unit"
          ml-1
        />
      </n-form-item>

      <n-form-item label="Duration (h/m/s):" label-placement="left">
        <n-input-number v-model:value="amountTransferableInput.hours" mr-1 placeholder="Hours" :min="0" w-full />
        <n-input-number v-model:value="amountTransferableInput.minutes" mr-1 placeholder="Minutes" :min="0" w-full />
        <n-input-number v-model:value="amountTransferableInput.seconds" mr-1 placeholder="Seconds" :min="0" w-full />
      </n-form-item>

      <n-divider />

      <div flex items-baseline gap-2>
        <InputCopyable
          label="Amount transferable:"
          label-position="left"
          :value="amountTransferableOutput"
          placeholder="Amount transferable will be here..."
        />
        <c-select
          v-model:value="amountTransferableInput.dataSizeUnit"
          searchable
          :options="allStorateUnits"
          placeholder="Select a storage unit"
          ml-1
        />
      </div>
    </c-card>
  </div>
</template>
