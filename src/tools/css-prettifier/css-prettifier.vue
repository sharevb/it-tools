<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const inputCSS = ref('');
const outputCSS = computed(() => {
  return beautify.css(inputCSS.value, {
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputCSS"
      multiline raw-text
      :placeholder="t('tools.css-prettifier.texts.placeholder-your-css-content')"
      rows="8"
      autofocus
      :label="t('tools.css-prettifier.texts.label-your-css-to-format-can-paste-from-clipboard')"
    />

    <n-divider />

    <n-form-item :label="t('tools.css-prettifier.texts.label-output-prettified-css')">
      <TextareaCopyable
        :value="outputCSS"
        multiline
        language="css"
        word-wrap
      />
    </n-form-item>
  </div>
</template>
