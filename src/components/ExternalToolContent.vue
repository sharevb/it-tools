<script setup lang="ts">
import DOMPurify from 'dompurify';

const route = useRoute();

const sanitizedContent = computed(() => {
  return DOMPurify.sanitize(route.meta.externalHTMLContent ?? '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });
});
</script>

<template>
  <div :key="route.path" class="external-tool" v-html="sanitizedContent" />
</template>
