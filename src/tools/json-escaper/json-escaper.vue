<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { addSlashes, removeSlashes } from 'slashes';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const wrapInQuotes = useQueryParamOrStorage({ name: 'wrap', storageName: 'json-escaper:wrap', defaultValue: false });
const unescapedInput = useQueryParam({ tool: 'json-escaper', name: 'escape', defaultValue: '' });
const escapedOutput = computed(
  () => {
    try {
      const slashedString = addSlashes(unescapedInput.value);
      if (wrapInQuotes.value) {
        return `"${slashedString}"`;
      }
      return slashedString;
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const escapedInput = useQueryParam({ tool: 'json-escaper', name: 'unescape', defaultValue: '' });
const unescapedOutput = computed(
  () => {
    try {
      return removeSlashes(escapedInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card :title="t('tools.json-escaper.texts.title-escape-json-string')">
      <c-input-text
        v-model:value="unescapedInput"
        :placeholder="t('tools.json-escaper.texts.placeholder-put-your-string-to-escape')"
        :label="t('tools.json-escaper.texts.label-string-to-escape')"
        raw-text
        multiline
        rows="5"
        mb-1
      />

      <n-space justify="center">
        <n-form-item mb-5 label-placement="left" :label="t('tools.json-escaper.texts.label-wrap-in-quotes')">
          <n-checkbox v-model:checked="wrapInQuotes" />
        </n-form-item>
      </n-space>

      <n-divider />

      <TextareaCopyable
        :label="t('tools.json-escaper.texts.label-escaped-string')"
        :value="escapedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>

    <c-card :title="t('tools.json-escaper.texts.title-unescape-json-string')" mt-5>
      <c-input-text
        v-model:value="escapedInput"
        :placeholder="t('tools.json-escaper.texts.placeholder-put-your-string-to-unescape')"
        :label="t('tools.json-escaper.texts.label-string-to-unescape')"
        raw-text
        multiline
        rows="5"
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        :label="t('tools.json-escaper.texts.label-unescaped-string')"
        :value="unescapedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>
  </div>
</template>
