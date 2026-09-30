<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import MenuIconItem from './MenuIconItem.vue';
import MenuItemWithTooltip from './MenuItemTooltip.vue';
import type { Tool, ToolCategory } from '@/tools/tools.types';

const props = withDefaults(defineProps<{ toolsByCategory?: ToolCategory[] }>(), { toolsByCategory: () => [] });
const { t } = useI18n();
const { toolsByCategory } = toRefs(props);
const route = useRoute();

// Memoize component creation functions - wrap in markRaw to prevent reactivity
const makeLabel = (tool: Tool) => () => markRaw(h(MenuItemWithTooltip, { tool, key: tool.path }));
const makeIcon = (tool: Tool) => () => markRaw(h(MenuIconItem, { tool, key: tool.path }));

const collapsedCategories = useStorage<Record<string, boolean>>(
  'menu-tool-option:collapsed-categories',
  {},
  undefined,
  {
    deep: true,
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  },
);

// Initialize default values for all categories
watchEffect(() => {
  const updates: Record<string, boolean> = {};
  let hasChanges = false;

  toolsByCategory.value.forEach(({ name }) => {
    if (!(name in collapsedCategories.value)) {
      updates[name] = true;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    Object.assign(collapsedCategories.value, updates);
  }
});

const isToggling = ref(false);
const menuContainerRefs = ref<Record<string, HTMLElement>>({});

// Every category starts coMount a category's items when it first opens, then keep themllapsed, so mounting all ~460 items up front built a
// menu nobody can see. Mount a category's items when it first opens, then keep them.
const openedCategories = ref<Record<string, boolean>>({});
watchEffect(() => {
  toolsByCategory.value.forEach(({ name }) => {
    if (collapsedCategories.value[name] === false) {
      openedCategories.value[name] = true;
    }
  });
});

function toggleCategoryCollapse({ name }: { name: string }) {
  collapsedCategories.value[name] = !collapsedCategories.value[name];
}

const areAllCollapsed = computed(() => {
  return toolsByCategory.value.every(({ name }) => collapsedCategories.value[name] !== false);
});

async function toggleAllCategories() {
  if (isToggling.value) {
    return;
  }

  isToggling.value = true;

  const shouldCollapse = !areAllCollapsed.value;
  const updates: Record<string, boolean> = {};

  toolsByCategory.value.forEach(({ name }) => {
    updates[name] = shouldCollapse;
  });

  Object.assign(collapsedCategories.value, updates);

  await nextTick();
  isToggling.value = false;
}

// Function to calculate animation duration based on number of items
function getAnimationDuration(itemCount: number): number {
  const baseDuration = 250;
  const durationIncrement = 5;

  return baseDuration + Math.min(itemCount, 30) * durationIncrement;
}

// Function to check if any tool in the category is active
function isCategoryActive(components: Tool[]): boolean {
  return components.some((tool) => tool.path === route.path);
}

// Depends on the tool list only: holding the collapsed/active flags in here rebuilt
// every category's `tools` array, re-rendering all ~460 items on each navigation.
const menuOptions = computed(() =>
  toolsByCategory.value.map(({ name, components }) => ({
    name,
    components,
    animationDuration: getAnimationDuration(components.length),
    tools: components.map((tool) => ({
      label: makeLabel(tool),
      icon: makeIcon(tool),
      key: tool.path,
    })),
  })),
);

async function scrollToActiveItem() {
  const activeCategory = toolsByCategory.value.find(({ components }) => isCategoryActive(components));

  if (activeCategory) {
    // Expand the active category
    collapsedCategories.value[activeCategory.name] = false;

    // Wait for the entire animation to complete
    await new Promise((resolve) => setTimeout(resolve, getAnimationDuration(activeCategory.components.length) + 50));

    // Scroll to the active menu item
    const menuContainer = menuContainerRefs.value[activeCategory.name];
    if (menuContainer) {
      const activeItem = menuContainer.querySelector('.router-link-exact-active, .router-link-active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

onMounted(() => {
  scrollToActiveItem();
});

watch(
  () => route.path,
  () => {
    scrollToActiveItem();
  },
);

const themeVars = useThemeVars();
</script>

<template>
  <div class="top-controls" mb-12px ml-12px>
    <c-button :disabled="isToggling" @click="toggleAllCategories">
      <span v-if="isToggling">
        {{ areAllCollapsed ? t('home.expanding') : t('home.collapsing') }}
      </span>
      <span v-else>
        {{ areAllCollapsed ? t('home.expandAllTools') : t('home.collapseAllTools') }}
      </span>
    </c-button>
  </div>

  <div v-for="{ name, components, tools, animationDuration } of menuOptions" :key="name" class="category-container">
    <button
      class="category-button"
      :class="{ 'category-active': isCategoryActive(components) }"
      flex
      cursor-pointer
      items-center
      op-60
      @click="toggleCategoryCollapse({ name })"
    >
      <span
        :class="{ 'rotate-0': collapsedCategories[name], 'rotate-90': !collapsedCategories[name] }"
        text-16px
        lh-1
        op-50
        transition-transform
        duration-200
      >
        <icon-mdi-chevron-right />
      </span>

      <span ml-8px text-13px>
        {{ name }}
      </span>
    </button>

    <div
      :ref="
        (el) => {
          if (el) menuContainerRefs[name] = el as HTMLElement;
        }
      "
      class="menu-container"
      :class="{ collapsed: collapsedCategories[name] }"
      :style="{ '--animation-duration': `${animationDuration}ms` }"
    >
      <div class="menu-wrapper">
        <div class="toggle-bar" @click="toggleCategoryCollapse({ name })" />

        <n-menu
          v-if="openedCategories[name]"
          class="menu"
          :value="route.path"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="tools"
          :indent="8"
          :default-expand-all="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.category-button {
  border: none;
  background: transparent;
  padding: 6px;
  width: 100%;
  color: v-bind('themeVars.textColor1');
  text-align: left;
  user-select: none;

  &:hover {
    background-color: v-bind('themeVars.buttonColor2Hover');
    opacity: 0.8;
  }

  &.category-active {
    background-color: color-mix(in srgb, v-bind('themeVars.primaryColor') 40%, transparent);
    opacity: 1;
    color: white;

    &:hover {
      background-color: color-mix(in srgb, v-bind('themeVars.primaryColorHover') 50%, transparent);
    }
  }
}
.category-container {
  // Offscreen categories skip layout and paint entirely, which keeps the sider
  // width transition and expand/collapse animations from re-laying-out all ~460
  // menu items on every frame.
  content-visibility: auto;
  contain-intrinsic-size: auto 36px;

  .menu-container {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--animation-duration, 250ms) ease-out;
    will-change: grid-template-rows;

    &.collapsed {
      grid-template-rows: 0fr;
    }

    .menu-wrapper {
      display: flex;
      flex-direction: row;
      overflow: hidden;

      .menu {
        flex: 1;
        margin-bottom: 5px;

        ::v-deep(.n-menu-item-content::before) {
          left: 0;
          right: 13px;
          transition: none !important; // Disables hover transition effect to instantly show hover state
        }
      }

      .toggle-bar {
        width: 24px;
        opacity: 0.1;
        transition: opacity ease 0.2s;
        position: relative;
        cursor: pointer;

        &::before {
          width: 2px;
          height: 100%;
          content: ' ';
          background-color: v-bind('themeVars.textColor3');
          border-radius: 2px;
          position: absolute;
          top: 0;
          left: 14px;
        }

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
