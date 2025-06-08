<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { RouterLink, useRoute } from 'vue-router';
import MenuIconItem from './MenuIconItem.vue';
import type { Tool, ToolCategory } from '@/tools/tools.types';

const props = withDefaults(defineProps<{ toolsByCategory?: ToolCategory[] }>(), { toolsByCategory: () => [] });
const { toolsByCategory } = toRefs(props);
const route = useRoute();

const makeLabel = (tool: Tool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
const makeIcon = (tool: Tool) => () => h(MenuIconItem, { tool });

const collapsedCategories = useStorage<Record<string, boolean>>(
  'menu-tool-option:collapsed-categories',
  {},
  undefined,
  {
    deep: true,
    serializer: {
      read: v => (v ? JSON.parse(v) : null),
      write: v => JSON.stringify(v),
    },
  },
);

const isToggling = ref(false);

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

const menuOptions = computed(() =>
  toolsByCategory.value.map(({ name, components }) => ({
    name,
    isCollapsed: collapsedCategories.value[name] === undefined ? true : collapsedCategories.value[name],
    tools: components.map(tool => ({
      label: makeLabel(tool),
      icon: makeIcon(tool),
      key: tool.path,
    })),
  })),
);

const themeVars = useThemeVars();
</script>

<template>
  <div class="top-controls" ml-6px>
    <c-button :disabled="isToggling" @click="toggleAllCategories">
      <span v-if="isToggling">
        {{ areAllCollapsed ? 'Expanding...' : 'Collapsing...' }}
      </span>
      <span v-else>
        {{ areAllCollapsed ? 'Expand All Tools' : 'Collapse All Tools' }}
      </span>
    </c-button>
  </div>

  <div v-for="{ name, tools, isCollapsed } of menuOptions" :key="name" class="category-container">
    <div ml-6px mt-12px flex cursor-pointer items-center op-60 @click="toggleCategoryCollapse({ name })">
      <span :class="{ 'rotate-0': isCollapsed, 'rotate-90': !isCollapsed }" text-16px lh-1 op-50 transition-transform>
        <icon-mdi-chevron-right />
      </span>

      <span ml-8px text-13px>
        {{ name }}
      </span>
    </div>

    <div class="menu-container" :class="{ collapsed: isCollapsed }">
      <div class="menu-wrapper">
        <div class="toggle-bar" @click="toggleCategoryCollapse({ name })" />

        <n-menu
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
.category-container {
  .menu-container {
    overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:not(.collapsed) {
      max-height: 1000px;
      opacity: 1;
      transform: translateY(0);
    }

    &.collapsed {
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
    }

    .menu-wrapper {
      display: flex;
      flex-direction: row;
      transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);

      .menu-container:not(.collapsed) & {
        transform: translateY(0);
      }

      .menu-container.collapsed & {
        transform: translateY(-20px);
      }

      .menu {
        flex: 1;
        margin-bottom: 5px;

        ::v-deep(.n-menu-item-content::before) {
          left: 0;
          right: 13px;
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
