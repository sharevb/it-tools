<script setup lang="ts">
import { marked } from 'marked';
import type { Tokens } from 'marked';
import DomPurify from 'dompurify';

const props = withDefaults(defineProps<{ markdown?: string }>(), { markdown: '' });
const { markdown } = toRefs(props);

marked.use({
  renderer: {
    link({ href, title, text }: Tokens.Link) {
      return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${text}</a>`;
    },
  },
});

const html = computed(() => DomPurify.sanitize(marked.parse(markdown.value) as string, { ADD_ATTR: ['target'] }));
</script>

<template>
  <div v-html="html" />
</template>
