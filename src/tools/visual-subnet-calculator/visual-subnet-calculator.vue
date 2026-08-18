<script setup lang="ts">
import { appBaseUrl as base } from '@/utils/base-url';
const isDarkTheme = useDark();
const iframeRef = ref<HTMLIFrameElement | null>(null);

const c = new URLSearchParams(window.location.search).get('c');

// Path to iframe content in /public
const parentUrl = encodeURIComponent(window.location.origin + window.location.pathname);
let iframeSrc = `${base}visualsubnetcalc/calc.html#html=calc.html&parent=${parentUrl}`;
if (c) {
  iframeSrc += `&c=${c}`;
}

// Apply theme to iframe document
function applyIframeTheme() {
  const iframe = iframeRef.value;
  if (!iframe) {
    return;
  }

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    return;
  }

  doc.documentElement.setAttribute(
    'data-bs-theme',
    isDarkTheme.value ? 'dark' : 'light',
  );
}

// Watch for theme changes
watch(isDarkTheme, () => {
  applyIframeTheme();
});

// Ensure iframe theme is applied after load
onMounted(() => {
  const iframe = iframeRef.value;
  if (!iframe) {
    return;
  }

  iframe.addEventListener('load', () => {
    applyIframeTheme();
  });
});
</script>

<template>
  <div>
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      style="width:100%; height:95vh;"
    />
  </div>
</template>
