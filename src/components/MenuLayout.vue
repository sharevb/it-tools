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

// Calculate the actual width to ensure minimum width is respected
const siderWidth = computed(() => {
  if (isMenuCollapsed.value) {
    return 0;
  }

<<<<<<< HEAD
  // Use 12.5% of window width, but ensure it's at least 240px
  const tenPercent = windowWidth.value * 0.125;
=======
  // Get 10% of window width, but ensure it's at least 240px
  const tenPercent = windowWidth.value * 0.1;
>>>>>>> chore/all-my-stuffs
  return Math.max(240, tenPercent);
});
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
