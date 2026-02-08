<script setup lang="ts">
import removeMarkdown from 'remove-markdown';

const markdown = ref('');
const plaintext = computed(() => {
  return removeMarkdown(markdown.value || '');
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="markdown"
      label="Input Mardown:"
      multiline
      placeholder="Enter your Markdown here..."
      rows="6"
      mb-2
    />

    <c-card v-if="plaintext" title="Output text">
      <textarea-copyable :value="plaintext" />
    </c-card>
  </div>
</template>
