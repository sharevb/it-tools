<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { convertEndian, formatInteger } from './middle-endian-converter.service';

const { t } = useI18n();

const inputHex = ref('');
const bitLength = ref(32);
const middleEndianType = ref('byte-swapped');
const result = computed(() => {
  try {
    const converted = convertEndian(inputHex.value, bitLength.value as never, middleEndianType.value as never);
    return {
      error: '',
      ...converted,
      ...formatInteger(converted.littleEndian),
    };
  } catch (e: any) {
    return {
      error: e.toString(),
      bigEndian: '',
      littleEndian: '',
      octal: '',
      decimal: '',
      hexadecimal: '',
    };
  }
});

const bitOptions = [
  { label: t('tools.middle-endian-converter.texts.label-16-bit'), value: 16 },
  { label: t('tools.middle-endian-converter.texts.label-32-bit'), value: 32 },
  { label: t('tools.middle-endian-converter.texts.label-64-bit'), value: 64 },
];

const middleEndianOptions = [
  { label: t('tools.middle-endian-converter.texts.label-byte-swapped'), value: 'byte-swapped' },
  { label: t('tools.middle-endian-converter.texts.label-word-swapped'), value: 'word-swapped' },
];
</script>

<template>
  <n-card
    :title="t('tools.middle-endian-converter.texts.title-endian-converter')"
    style="max-width: 700px; margin: auto"
  >
    <n-space vertical>
      <n-input
        v-model:value="inputHex"
        :placeholder="t('tools.middle-endian-converter.texts.placeholder-enter-hex-e-g-3412abcd')"
        clearable
      />
      <n-select
        v-model:value="bitLength"
        :options="bitOptions"
        :label="t('tools.middle-endian-converter.texts.label-bit-length')"
        :placeholder="t('tools.middle-endian-converter.texts.placeholder-select-bit-length')"
      />
      <n-select
        v-model:value="middleEndianType"
        :options="middleEndianOptions"
        :label="t('tools.middle-endian-converter.texts.label-middle-endian-type')"
        :placeholder="t('tools.middle-endian-converter.texts.placeholder-select-middle-endian-format')"
      />
      <c-alert v-if="inputHex && result.error">
        {{ result.error }}
      </c-alert>
      <n-card
        v-if="inputHex && !result.error"
        :title="t('tools.middle-endian-converter.texts.title-conversion-result')"
      >
        <input-copyable
          :label="t('tools.middle-endian-converter.texts.label-big-endian')"
          label-width="120px"
          label-position="left"
          :value="result.bigEndian"
        />
        <input-copyable
          :label="t('tools.middle-endian-converter.texts.label-little-endian')"
          label-width="120px"
          label-position="left"
          :value="result.littleEndian"
        />
        <input-copyable
          :label="t('tools.middle-endian-converter.texts.label-decimal')"
          label-width="120px"
          label-position="left"
          :value="result.decimal"
          mt-2
        />
        <input-copyable
          :label="t('tools.middle-endian-converter.texts.label-octal')"
          label-width="120px"
          label-position="left"
          :value="result.octal"
        />
        <input-copyable
          :label="t('tools.middle-endian-converter.texts.label-hexadecimal')"
          label-width="120px"
          label-position="left"
          :value="result.hexadecimal"
        />
      </n-card>
    </n-space>
  </n-card>
</template>
