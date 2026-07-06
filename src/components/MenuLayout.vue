<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);
const siderPosition = computed(() => (isSmallScreen.value ? 'absolute' : 'static'));

// Reactive window width
const windowWidth = ref(window.innerWidth);

// Update window width on resize
function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Add resize listener
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

// Clean up listener
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

// Use 12.5% of window width, but ensure it's at least 240px
const siderContentWidth = computed(() => Math.max(240, windowWidth.value * 0.125));

const siderWidth = computed(() => (isMenuCollapsed.value ? 0 : siderContentWidth.value));

// The scroll container is pinned to the expanded width so the sider width
// transition clips the menu instead of re-wrapping every item on each frame.
const siderContentWidthPx = computed(() => `${siderContentWidth.value}px`);
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="siderWidth"
      :collapsed="isMenuCollapsed"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
    >
      <slot name="sider" />
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
      <div v-show="isSmallScreen && !isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.n-layout-sider {
  // With :native-scrollbar="false" the sider content lives in an n-scrollbar.
  ::v-deep(.n-scrollbar-content) {
    width: v-bind(siderContentWidthPx);
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  cursor: pointer;
}

.content {
  // background-color: #f1f5f9;
  ::v-deep(.n-layout-scroll-container) {
    padding: 26px;
  }
}

.n-layout {
  height: 100vh;
}
</style>
