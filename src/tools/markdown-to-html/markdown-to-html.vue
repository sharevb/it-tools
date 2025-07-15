<script setup lang="ts">
import markdownit from 'markdown-it';
import markdownitSanitizer from 'markdown-it-sanitizer';
import markdownitSup from 'markdown-it-sup';
import markdownitSub from 'markdown-it-sub';
import markdownitMark from 'markdown-it-mark';
import { align } from '@mdit/plugin-align';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const handleHtml = ref(true);
const sanitize = ref(true);
const handleAlign = ref(false);
const handleSubSup = ref(false);
const handleMark = ref(false);

const inputMarkdown = ref('');
const outputHtml = computed(() => {
  let md = markdownit({ html: handleHtml.value });
  if (handleHtml.value && sanitize.value) {
    md = md.use(markdownitSanitizer);
  }
  if (handleAlign.value) {
    md = md.use(align as never);
  }
  if (handleSubSup.value) {
    md = md.use(markdownitSub).use(markdownitSup);
  }
  if (handleMark.value) {
    md = md.use(markdownitMark);
  }
  return md.render(inputMarkdown.value);
});
const { t } = useI18n();

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      :placeholder="t('tools.markdown-to-html.markdownInput')"
      rows="8"
      autofocus
      :label="t('tools.markdown-to-html.markdown')"
    />

    <n-space justify="center" gap-1>
      <n-checkbox v-model:checked="handleHtml">
        {{ t('tools.markdown-to-html.texts.tag-allow-html-tags') }}
      </n-checkbox>
      <n-checkbox v-model:checked="sanitize" :disabled="!handleHtml">
        {{ t('tools.markdown-to-html.texts.tag-sanitize-html') }}
      </n-checkbox>
      <n-checkbox v-model:checked="handleSubSup">
        {{ t('tools.markdown-to-html.texts.tag-allow-superscript-and-subscript') }}
      </n-checkbox>
      <n-checkbox v-model:checked="handleAlign">
        {{ t('tools.markdown-to-html.texts.tag-handle') }}<n-a href="https://mdit-plugins.github.io/align.html#syntax" target="blank">
          {{ t('tools.markdown-to-html.texts.tag-alignment') }}
        </n-a>
      </n-checkbox>
      <n-checkbox v-model:checked="handleMark">
        {{ t('tools.markdown-to-html.texts.tag-allow-mark') }}
      </n-checkbox>
    </n-space>

    <n-divider />

    <n-form-item :label="t('tools.markdown-to-html.html')">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </n-form-item>

    <div flex justify-center>
      <n-button @click="printHtml">
        {{ t('tools.markdown-to-html.texts.tag-print-ie-use-a-pdf-printer-to-get-a-pdf-file') }}
      </n-button>
    </div>
  </div>
</template>
