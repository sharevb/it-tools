<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { useStyleStore } from '@/stores/style.store';

const themeVars = useThemeVars();
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

// Small screens: the menu is a full-width panel below the top bar that fades
// in/out (see styles below) instead of naive-ui's width-collapse, which
// re-lays-out the page on every animation frame.
const siderWidth = computed(() => {
  if (isSmallScreen.value) {
    return windowWidth.value;
  }
  return isMenuCollapsed.value ? 0 : siderContentWidth.value;
});
const siderCollapsed = computed(() => (isSmallScreen.value ? false : isMenuCollapsed.value));
const isDrawerOpen = computed(() => isSmallScreen.value && !isMenuCollapsed.value);

// Native-drawer touch: lock the page scroll while the drawer is open
watchEffect(() => {
  document.body.style.overflow = isDrawerOpen.value ? 'hidden' : '';
});

// Close the menu when navigating (tool links, the about button, ...) so the
// destination page is visible.
const route = useRoute();
watch(() => route.path, () => {
  if (isSmallScreen.value) {
    isMenuCollapsed.value = true;
  }
});
onUnmounted(() => {
  document.body.style.overflow = '';
});

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
      :collapsed="siderCollapsed"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
      :class="{ 'drawer-open': isDrawerOpen }"
    >
      <slot name="sider" />
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
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

.content {
  // background-color: #f1f5f9;
  ::v-deep(.n-layout-scroll-container) {
    padding: 26px;

    // Same breakpoint as styleStore.isSmallScreen
    @media (max-width: 700px) {
      padding: 13px;
    }
  }
}

// The document is the app's scroller: layouts grow with their content instead
// of scrolling in a nested container. A single scrollbar, and native behaviors
// (iOS tap-status-bar-to-scroll-to-top, toolbar collapsing) just work.
.n-layout {
  height: auto;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: visible;

  ::v-deep(> .n-layout-scroll-container) {
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: visible;
  }
}

// The sider keeps its own internal menu scrollbar, pinned to the viewport
// while the document scrolls.
.n-layout-sider {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  height: 100dvh;

  // Small screens: full-width panel fixed below the always-visible top bar
  // (height exposed by base.layout.vue), fading in/out quickly. Seamless with
  // the page: same background as the app, no side border.
  &.n-layout-sider--absolute-positioned {
    position: fixed;
    top: var(--app-topbar-height, 56px);
    bottom: auto;
    height: calc(100dvh - var(--app-topbar-height, 56px));
    z-index: 15;
    background-color: v-bind('themeVars.bodyColor');
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.2s ease,
      visibility 0s 0.2s;

    &.drawer-open {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.2s ease;
    }

    // Full-width menu content instead of the pinned desktop width
    ::v-deep(.n-scrollbar-content) {
      width: 100%;
    }

    // The menu's own scroll shouldn't chain to the page behind it
    ::v-deep(.n-scrollbar-container) {
      overscroll-behavior: contain;
    }

    // No side border on a full-width panel
    ::v-deep(.n-layout-sider__border) {
      display: none;
    }
  }
}
</style>
