<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DOMPurify from 'dompurify';
import beautify from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const { t } = useI18n();

const inputHtml = ref('');
const outputHtml = computed(() => {
  const cleanedHtml = DOMPurify.sanitize(inputHtml.value ?? '',
    {
      ALLOWED_ATTR: [
        'href', 'src',
        'width', 'height',
        'alt',
        'colspan', 'rowspan',
      ],
      FORBID_TAGS: ['form', 'span'],
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false,
    });
  return beautify.html(cleanedHtml, {
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 2,
    eol: '\n',
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputHtml"
      multiline raw-text
      :placeholder="t('tools.html-cleaner.texts.placeholder-your-html-content')"
      rows="8"
      autofocus
      :label="t('tools.html-cleaner.texts.label-your-html-to-clean-can-paste-from-clipboard')"
      paste-html
    />

    <n-divider />

    <n-form-item :label="t('tools.html-cleaner.texts.label-output-cleaned-html')">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        :word-wrap="true"
      />
    </n-form-item>
  </div>
</template>
