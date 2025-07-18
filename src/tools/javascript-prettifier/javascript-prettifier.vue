<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const inputJS = ref('');
const outputJS = computed(() => {
  return beautify(inputJS.value, {
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputJS"
      multiline raw-text
      :placeholder="t('tools.javascript-prettifier.texts.placeholder-your-js-content')"
      rows="8"
      autofocus
      :label="t('tools.javascript-prettifier.texts.label-your-js-to-format-can-paste-from-clipboard')"
    />

    <n-divider />

    <n-form-item :label="t('tools.javascript-prettifier.texts.label-output-prettified-js')">
      <TextareaCopyable
        :value="outputJS"
        multiline
        language="javascript"
        word-wrap
      />
    </n-form-item>
  </div>
</template>
