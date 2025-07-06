<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { minify, prettify } from 'htmlfy';
import { useStorage } from '@vueuse/core';
import Editor from './editor/editor.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const html = useStorage('html-wysiwyg-editor--html', '<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>');

const minifyOutput = useQueryParamOrStorage({ name: 'minify', storageName: 'html-wysiwyg-editor--min', defaultValue: false });

const formattedHtml = computed(() => {
  try {
    if (minifyOutput.value) {
      return minify(html.value);
    }

    return prettify(html.value);
  }
  catch {
    return html.value;
  }
});
</script>

<template>
  <details>
    <summary>{{ t('tools.html-wysiwyg-editor.texts.tag-click-here-to-paste-or-edit-raw-html') }}</summary>
    <c-input-text
      v-model:value="html"
      multiline raw-text
      :placeholder="t('tools.html-wysiwyg-editor.texts.placeholder-your-html-content')"
      rows="8"
      autofocus
      :label="t('tools.html-wysiwyg-editor.texts.label-your-html-to-convert-can-paste-from-clipboard')"
      paste-html
    />
  </details>
  <Editor v-model:html="html" />
  <NSpace justify="center">
    <n-form-item :label="t('tools.html-wysiwyg-editor.texts.label-minify')" label-placement="left" mt-2>
      <NSwitch v-model:value="minifyOutput" />
    </n-form-item>
  </NSpace>
  <TextareaCopyable :value="formattedHtml" language="html" />
</template>
