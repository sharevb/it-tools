<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { generatePassword } from './password-generator.service';

const { t } = useI18n();
const length = useQueryParamOrStorage({ name: 'length', storageName: 'password-generator:length', defaultValue: 12 });
const withLowercase = useQueryParamOrStorage({ name: 'lowercase', storageName: 'password-generator:lowercase', defaultValue: true });
const withUppercase = useQueryParamOrStorage({ name: 'uppercase', storageName: 'password-generator:uppercase', defaultValue: true });
const withNumbers = useQueryParamOrStorage({ name: 'numbers', storageName: 'password-generator:numbers', defaultValue: true });
const withSymbols = useQueryParamOrStorage({ name: 'symbols', storageName: 'password-generator:symbols', defaultValue: true });
const excludedChars = useQueryParamOrStorage({ name: 'exclude', storageName: 'password-generator:excluded-chars', defaultValue: '' });

const [generation, refreshPassword] = computedRefreshable(() => {
  try {
    return { password: generatePassword({
      length: length.value,
      withLowercase: withLowercase.value,
      withUppercase: withUppercase.value,
      withNumbers: withNumbers.value,
      withSymbols: withSymbols.value,
      excludedChars: excludedChars.value,
    }), error: '' };
  }
  catch (error) {
    return { password: '', error: error instanceof Error ? error.message : t('tools.password-generator.texts.error-generate-password') };
  }
});

const password = computed(() => generation.value.password);
const error = computed(() => generation.value.error);
const { copy } = useCopy({ source: password, text: t('tools.password-generator.texts.text-password-copied-to-clipboard') });
</script>

<template>
  <c-card>
    <n-form label-placement="left" label-width="140">
      <n-form-item :label="`${t('tools.password-generator.texts.label-password-length')} (${length})`">
        <n-slider v-model:value="length" :step="1" :min="4" :max="128" mr-2 />
        <n-input-number-i18n v-model:value="length" :min="4" :max="128" size="small" />
      </n-form-item>

      <n-space justify="center">
        <n-form-item :label="t('tools.password-generator.texts.label-lowercase')">
          <n-switch v-model:value="withLowercase" />
        </n-form-item>
        <n-form-item :label="t('tools.password-generator.texts.label-uppercase')">
          <n-switch v-model:value="withUppercase" />
        </n-form-item>
        <n-form-item :label="t('tools.password-generator.texts.label-numbers')">
          <n-switch v-model:value="withNumbers" />
        </n-form-item>
        <n-form-item :label="t('tools.password-generator.texts.label-symbols')">
          <n-switch v-model:value="withSymbols" />
        </n-form-item>
      </n-space>

      <n-form-item :label="t('tools.password-generator.texts.label-excluded-characters')" label-placement="top">
        <c-input-text
          v-model:value="excludedChars"
          :placeholder="t('tools.password-generator.texts.placeholder-excluded-characters')"
        />
      </n-form-item>
    </n-form>

    <n-alert v-if="error" type="error" mb-4>
      {{ error }}
    </n-alert>

    <c-input-text
      :value="password"
      :placeholder="t('tools.password-generator.texts.placeholder-generated-password')"
      readonly
      class="password-display"
    />

    <div mt-5 flex justify-center gap-3>
      <c-button :disabled="Boolean(error)" @click="copy()">
        {{ t('tools.password-generator.texts.button-copy') }}
      </c-button>
      <c-button @click="refreshPassword">
        {{ t('tools.password-generator.texts.button-refresh') }}
      </c-button>
    </div>
  </c-card>
</template>

<style scoped lang="less">
::v-deep(.password-display input) {
  text-align: center;
}
</style>
