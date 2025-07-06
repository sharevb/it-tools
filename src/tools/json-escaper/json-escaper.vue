<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { addSlashes, removeSlashes } from 'slashes';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const unescapedInput = ref('');
const escapedOutput = computed(
  () => {
    try {
      return addSlashes(unescapedInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const escapedInput = ref('');
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
        mb-5
      />

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
