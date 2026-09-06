<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

type NumberFormat = 'dec' | 'hex' | 'oct' | 'bin';

const inputFormatA = useQueryParamOrStorage<NumberFormat>({
  name: 'text',
  storageName: 'bin-calc:fa',
  defaultValue: 'dec',
});
const inputFormatB = useQueryParamOrStorage<NumberFormat>({
  name: 'text',
  storageName: 'bin-calc:fb',
  defaultValue: 'dec',
});
const operation = useQueryParamOrStorage({ name: 'op', storageName: 'bin-calc:o', defaultValue: 'AND' });
const inputA = ref('');
const inputB = ref('');

const formatOptions = [
  { label: t('tools.binary-calculator.texts.label-decimal'), value: 'dec' },
  { label: t('tools.binary-calculator.texts.label-hexadecimal'), value: 'hex' },
  { label: t('tools.binary-calculator.texts.label-octal'), value: 'oct' },
  { label: t('tools.binary-calculator.texts.label-binary'), value: 'bin' },
];

const operations = [
  { label: t('tools.binary-calculator.texts.label-a-and-b'), value: 'AND' },
  { label: t('tools.binary-calculator.texts.label-a-or-b'), value: 'OR' },
  { label: t('tools.binary-calculator.texts.label-a-xor-b'), value: 'XOR' },
  { label: t('tools.binary-calculator.texts.label-not-a'), value: 'NOT' },
  { label: t('tools.binary-calculator.texts.label-a-b-left-shift'), value: 'LSHIFT' },
  { label: t('tools.binary-calculator.texts.label-a-b-right-shift'), value: 'RSHIFT' },
];

const inputAValidation = useValidation({
  source: inputA,
  watch: [inputFormatA],
  rules: [
    {
      validator: (v) => parseInputA(v) !== null,
      message: t('tools.binary-calculator.texts.message-number-is-invalid'),
    },
  ],
});
const inputBValidation = useValidation({
  source: inputB,
  watch: [inputFormatB],
  rules: [
    {
      validator: (v) => parseInputB(v) !== null,
      message: t('tools.binary-calculator.texts.message-number-is-invalid'),
    },
  ],
});

const isUnary = computed(() => operation.value === 'NOT');

function parseInput(value: string, format: NumberFormat): number | null {
  if (value === '') {
    return null;
  }

  try {
    let num: number;
    switch (format) {
      case 'dec':
        num = Number.parseInt(value, 10);
        break;
      case 'hex':
        num = Number.parseInt(value.replace(/^0x/i, ''), 16);
        break;
      case 'oct':
        num = Number.parseInt(value.replace(/^0o/i, ''), 8);
        break;
      case 'bin':
        num = Number.parseInt(value.replace(/^0b/i, ''), 2);
        break;
    }
    if (Number.isNaN(num)) {
      return null;
    }
    return num;
  } catch {
    return null;
  }
}
function parseInputA(value: string) {
  return parseInput(value, inputFormatA.value);
}
function parseInputB(value: string) {
  return parseInput(value, inputFormatA.value);
}

const result = computed(() => {
  const a = parseInputA(inputA.value);
  const b = parseInputB(inputB.value);

  if (a === null || (!isUnary.value && b === null)) {
    return null;
  }

  switch (operation.value) {
    case 'AND':
      return a & b!;
    case 'OR':
      return a | b!;
    case 'XOR':
      return a ^ b!;
    case 'NOT':
      return ~a;
    case 'LSHIFT':
      return a << b!;
    case 'RSHIFT':
      return a >> b!;
    default:
      return null;
  }
});

const signedResult = computed(() => (result.value !== null ? (result.value | 0).toString() : ''));
const unsignedResult = computed(() => (result.value !== null ? (result.value >>> 0).toString() : ''));
const bitmask = computed(() =>
  result.value !== null ? (result.value >>> 0).toString(2).padStart(32, '0').split('') : [],
);
</script>

<template>
  <div style="min-height: 50vh; max-width: 800px">
    <n-space justify="space-evenly" mb-2>
      <NSelect v-model:value="inputFormatA" :options="formatOptions" style="width: 130px" />
      <c-input-text
        v-model:value="inputA"
        style="width: 150px"
        :validation="inputAValidation"
        label-position="left"
        :label="t('tools.binary-calculator.texts.label-a')"
        :placeholder="t('tools.binary-calculator.texts.placeholder-enter-a')"
      />
      <NSelect v-model:value="inputFormatB" :options="formatOptions" style="width: 130px" />
      <c-input-text
        v-model:value="inputB"
        style="width: 150px"
        :validation="inputBValidation"
        label-position="left"
        :label="t('tools.binary-calculator.texts.label-b')"
        :placeholder="t('tools.binary-calculator.texts.placeholder-enter-b')"
        :disabled="isUnary"
      />
    </n-space>

    <c-select
      v-model:value="operation"
      :label="t('tools.binary-calculator.texts.label-operation')"
      label-position="left"
      :options="operations"
      :placeholder="t('tools.binary-calculator.texts.placeholder-select-operation')"
      mb-2
    />

    <c-card v-if="result !== null" :title="t('tools.binary-calculator.texts.title-result')" mb-1>
      <input-copyable
        label-width="130px"
        mb-1
        :label="t('tools.binary-calculator.texts.label-decimal-signed')"
        label-position="left"
        :value="signedResult"
      />
      <input-copyable
        label-width="130px"
        mb-1
        :label="t('tools.binary-calculator.texts.label-decimal-unigned')"
        label-position="left"
        :value="unsignedResult"
      />
      <input-copyable
        label-width="130px"
        mb-1
        :label="t('tools.binary-calculator.texts.label-binary')"
        label-position="left"
        :value="`0b${result.toString(2).padStart(32, '0')}`"
      />
      <input-copyable
        label-width="130px"
        mb-1
        :label="t('tools.binary-calculator.texts.label-hexadecimal')"
        label-position="left"
        :value="`0x${result.toString(16).toUpperCase()}`"
      />
      <input-copyable
        label-width="130px"
        mb-1
        :label="t('tools.binary-calculator.texts.label-octal')"
        label-position="left"
        :value="`0o${result.toString(8)}`"
      />
    </c-card>

    <c-card v-if="result !== null" :title="t('tools.binary-calculator.texts.title-bitmask')">
      <NSpace justify="center" wrap>
        <NTag v-for="(bit, index) in bitmask" :key="index" :type="bit === '1' ? 'success' : 'default'" size="small">
          {{ bit }}
        </NTag>
      </NSpace>
    </c-card>
  </div>
</template>
