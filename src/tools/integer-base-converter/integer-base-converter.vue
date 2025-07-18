<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase, hasNumberPrefix } from './integer-base-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';

const { t } = useI18n();

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

const hasInputNumberPrefix = computed(() => hasNumberPrefix(input.value));

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  }
  catch (err) {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
);
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" :label="t('tools.integer-base-converter.texts.label-input-number')" :placeholder="t('tools.integer-base-converter.texts.placeholder-put-your-number-here-ex-42')" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item v-if="!hasInputNumberPrefix" :label="t('tools.integer-base-converter.texts.label-input-base')" label-placement="left" label-width="110" :show-feedback="false">
        <n-input-number v-model:value="inputBase" max="64" min="2" :placeholder="t('tools.integer-base-converter.texts.placeholder-put-your-input-base-here-ex-10')" w-full />
      </n-form-item>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-binary-2')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-binary-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-octal-8')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-octal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-decimal-10')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-decimal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-hexadecimal-16')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-hexadecimal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-base64-64')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-base64-version-will-be-here')"
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label>{{ t('tools.integer-base-converter.texts.tag-custom') }}</n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="`Base ${outputBase} will be here...`"
        />
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
