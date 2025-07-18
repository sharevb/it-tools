<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const input = ref('');
const cleaningRegex = useQueryParamOrStorage({ name: 'clean', storageName: 'dedup:clean', defaultValue: '' });
const regexValidation = useValidation({
  source: cleaningRegex,
  rules: [
    {
      message: t('tools.duplicate-line-finder.texts.message-invalid-regex-0'),
      validator: value => new RegExp(value),
      getErrorMessage: (value) => {
        const _ = new RegExp(value);
        return '';
      },
    },
  ],
});

const duplicatedLines = computed(() => {
  const clean = new RegExp(cleaningRegex.value, 'g');
  const lines = input.value.split('\n');
  return _.uniq(_.filter(lines.map(val => val.replace(clean, '')), (val, i, iteratee) => val && _.includes(iteratee, val, i + 1))).join('\n');
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :placeholder="t('tools.duplicate-line-finder.texts.placeholder-your-string-to-list-duplicated-lines')"
      raw-text
      multiline
      rows="10"
      :label="t('tools.duplicate-line-finder.texts.label-your-text')"
      mb-2
    />
    <c-input-text
      v-model:value="cleaningRegex"
      :placeholder="t('tools.duplicate-line-finder.texts.placeholder-your-cleaning-regex')"
      raw-text
      :label="t('tools.duplicate-line-finder.texts.label-cleaning-regex')"
      label-position="left"
      label-align="right"
      label-width="120px"
      :validation="regexValidation"
      mb-2
    />

    <n-form-item :label="t('tools.duplicate-line-finder.texts.label-duplicated-lines')">
      <textarea-copyable :value="duplicatedLines" />
    </n-form-item>
  </div>
</template>
