<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Tool } from '@/tools/tools.types';

defineProps<{
  tool: Tool;
}>();

const textRef = ref<HTMLElement>();
const showTooltip = ref(false);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

// Must settle before the pointer arrives: n-tooltip reads `disabled` on enter,
// so deciding on hover would leave the first hover with a stale value.
async function checkTruncation() {
  await nextTick();

  const el = textRef.value;

  if (el) {
    // .menu-text is one nowrap ellipsised line, so overflow is exactly the condition.
    // Replaces a canvas measureText() that cost a <canvas> + getComputedStyle per item.
    showTooltip.value = el.scrollWidth > el.clientWidth;
  }
}

function debouncedCheckTruncation() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  // Prevent the truncation check from running too frequently when the window is resized
  resizeTimeout = setTimeout(checkTruncation, 500);
}

onMounted(() => {
  checkTruncation();
  window.addEventListener('resize', debouncedCheckTruncation);
});

onUnmounted(() => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  window.removeEventListener('resize', debouncedCheckTruncation);
});
</script>

<template>
  <n-tooltip placement="right" :delay="500" :show-arrow="true" :disabled="!showTooltip">
    <template #trigger>
      <RouterLink :to="tool.path" class="menu-link">
        <span ref="textRef" class="menu-text" @mouseenter="checkTruncation">
          {{ tool.name }}
        </span>
      </RouterLink>
    </template>
    {{ tool.name }}
  </n-tooltip>
</template>

<style scoped>
.menu-link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: inherit;
}

.menu-text {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
