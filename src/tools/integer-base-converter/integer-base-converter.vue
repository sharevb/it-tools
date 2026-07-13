<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase, hasNumberPrefix, formatWithSpaces } from './integer-base-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';
import { useQueryParam } from '@/composable/queryParams';

const { t } = useI18n();

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;

const input = useQueryParam({ tool: 'int-base-conv', name: 'num', defaultValue: '42' });
const inputBase = useQueryParam({ tool: 'int-base-conv', name: 'base', defaultValue: 10 });
const outputBase = useQueryParam({ tool: 'int-base-conv', name: 'outbase', defaultValue: 42 });

const hasInputNumberPrefix = computed(() => hasNumberPrefix(input.value));

const useSpaceSeparation = ref(false);
const groupSizes = ref({
  binary: 8,
  octal: 3,
  decimal: 3,
  hex: 4,
  base64: 4,
  custom: 4,
});

function getGroupSizeForBase(base: number): number {
  if (!useSpaceSeparation.value) {
    return 0;
  }
  switch (base) {
    case 2: return groupSizes.value.binary;
    case 8: return groupSizes.value.octal;
    case 10: return groupSizes.value.decimal;
    case 16: return groupSizes.value.hex;
    case 64: return groupSizes.value.base64;
    default:
      return base === outputBase.value ? groupSizes.value.custom : 4;
  }
}

function formattedConvert(args: Parameters<typeof convertBase>[0]) {
  try {
    const converted = convertBase(args);
    const size = getGroupSizeForBase(args.toBase);
    if (useSpaceSeparation.value && size > 0) {
      return formatWithSpaces(converted, size);
    }
    return converted;
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
        <n-input-number-i18n v-model:value="inputBase" max="64" min="2" :placeholder="t('tools.integer-base-converter.texts.placeholder-put-your-input-base-here-ex-10')" w-full />
      </n-form-item>

      <n-form-item :label="t('tools.integer-base-converter.texts.label-space-separation')" label-placement="left" label-width="110" :show-feedback="false" style="margin-top: 10px;">
        <n-switch v-model:value="useSpaceSeparation" />
      </n-form-item>

      <div v-if="useSpaceSeparation" style="margin-top: 10px; margin-bottom: 20px; padding-left: 20px; border-left: 2px solid var(--n-border-color)">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
          <n-form-item :label="t('tools.integer-base-converter.texts.label-binary-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.binary" :min="1" :max="64" size="small" />
          </n-form-item>
          <n-form-item :label="t('tools.integer-base-converter.texts.label-octal-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.octal" :min="1" :max="64" size="small" />
          </n-form-item>
          <n-form-item :label="t('tools.integer-base-converter.texts.label-decimal-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.decimal" :min="1" :max="64" size="small" />
          </n-form-item>
          <n-form-item :label="t('tools.integer-base-converter.texts.label-hexadecimal-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.hex" :min="1" :max="64" size="small" />
          </n-form-item>
          <n-form-item :label="t('tools.integer-base-converter.texts.label-base64-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.base64" :min="1" :max="64" size="small" />
          </n-form-item>
          <n-form-item :label="t('tools.integer-base-converter.texts.label-custom-size')" label-placement="top" :show-feedback="false">
            <n-input-number v-model:value="groupSizes.custom" :min="1" :max="64" size="small" />
          </n-form-item>
        </div>
      </div>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-binary-2')"
        v-bind="inputProps"
        :value="formattedConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-binary-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-octal-8')"
        v-bind="inputProps"
        :value="formattedConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-octal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-decimal-10')"
        v-bind="inputProps"
        :value="formattedConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-decimal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-hexadecimal-16')"
        v-bind="inputProps"
        :value="formattedConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-hexadecimal-version-will-be-here')"
      />

      <InputCopyable
        :label="t('tools.integer-base-converter.texts.label-base64-64')"
        v-bind="inputProps"
        :value="formattedConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        :placeholder="t('tools.integer-base-converter.texts.placeholder-base64-version-will-be-here')"
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label>{{ t('tools.integer-base-converter.texts.tag-custom') }}</n-input-group-label>
          <n-input-number-i18n v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="formattedConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
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
