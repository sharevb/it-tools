<script setup lang="ts">
import { minify } from 'htmlfy';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

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
      placeholder="Your HTML content..."
      rows="8"
      autofocus
      label="Your HTML to minify (can paste from clipboard):"
      paste-html
    />

    <n-divider />

    <n-form-item label="Output minified HTML:">
      <TextareaCopyable
        :value="outputHtml"
        multiline
        language="html"
        :word-wrap="true"
      />
    </n-form-item>
  </div>
</template>
