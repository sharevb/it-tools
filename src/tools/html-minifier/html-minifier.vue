<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { minify } from 'htmlfy';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const inputHtml = ref('');
const outputHtml = computed(() => {
  try {
    return minify(inputHtml.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      :placeholder="t('tools.html-minifier.texts.placeholder-your-html-content')"
      rows="8"
      autofocus
      :label="t('tools.html-minifier.texts.label-your-html-to-minify-can-paste-from-clipboard')"
      paste-html
    />

    <n-divider />

    <n-form-item :label="t('tools.html-minifier.texts.label-output-minified-html')">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        :word-wrap="true"
      />
    </n-form-item>
  </div>
</template>
