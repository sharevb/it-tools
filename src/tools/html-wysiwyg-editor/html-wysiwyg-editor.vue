<script setup lang="ts">
import { minify, prettify } from 'htmlfy';
import { useStorage } from '@vueuse/core';
import Editor from './editor/editor.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

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
    <summary>Click here to paste or edit raw html</summary>
    <c-input-text
      v-model:value="html"
      multiline raw-text
      placeholder="Your Html content..."
      rows="8"
      autofocus
      label="Your Html to convert (can paste from clipboard):"
      paste-html
    />
  </details>
  <Editor v-model:html="html" />
  <NSpace justify="center">
    <n-form-item label="Minify:" label-placement="left" mt-2>
      <NSwitch v-model:value="minifyOutput" />
    </n-form-item>
  </NSpace>
  <TextareaCopyable :value="formattedHtml" language="html" />
</template>
