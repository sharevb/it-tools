<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { decode, encode } from 'morsee';
import { computedCatch } from '@/composable/computed/catchedComputed';

const { t } = useI18n();

const encodeInput = ref('');
const encodeOutput = computed(() => encode(encodeInput.value));

const decodeInput = ref('');
const [decodeOutput, decodeError] = computedCatch(() => decode(decodeInput.value), {
  defaultValue: '',
  defaultErrorMessage: 'Unable to decode your text',
});
</script>

<template>
  <c-card :title="t('tools.morse-converter.texts.title-encode')">
    <div flex gap-3>
      <c-input-text
        v-model:value="encodeInput"
        :label="t('tools.morse-converter.texts.label-your-text')"
        :placeholder="t('tools.morse-converter.texts.placeholder-the-string-to-encode')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
    </div>
    <c-input-text
      :label="t('tools.morse-converter.texts.label-your-text-encoded-to-morse-code')"
      :value="encodeOutput"
      rows="3"
      :placeholder="t('tools.morse-converter.texts.placeholder-your-string-encoded')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card :title="t('tools.morse-converter.texts.title-decode')">
    <div flex gap-3>
      <c-input-text
        v-model:value="decodeInput"
        :label="t('tools.morse-converter.texts.label-your-morse-encoded-text')"
        :placeholder="t('tools.morse-converter.texts.placeholder-the-string-to-decode')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
    </div>
    <c-alert v-if="decodeError" type="error" mt-12 :title="t('tools.morse-converter.texts.title-error-while-decoding')">
      {{ decodeError }}
    </c-alert>
    <c-input-text
      v-else
      :label="t('tools.morse-converter.texts.label-your-decoded-text')"
      :value="decodeOutput"
      :placeholder="t('tools.morse-converter.texts.placeholder-your-string-decoded')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
