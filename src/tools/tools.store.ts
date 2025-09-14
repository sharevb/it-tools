import { type MaybeRef, get } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import _ from 'lodash';
import type { Tool, ToolCategory, ToolWithCategory, ToolsFilter } from './tools.types';
import { tools as allTools } from './index';
import { useITStorage } from '@/composable/queryParams';

const base = import.meta.env.BASE_URL ?? '/';
let filterConfig: ToolsFilter = {};
try {
  const remoteConfigResponse = await fetch(`${base}tools-filter.json`);
  if (remoteConfigResponse.ok) {
    filterConfig = (await remoteConfigResponse.json()) as ToolsFilter;
  }
}
catch {}

export const useToolStore = defineStore('tools', () => {
  const favoriteToolsName = useITStorage('favoriteToolsName', []) as Ref<string[]>;
  const { t } = useI18n();

  const makeRegExp = (regex: string | undefined) => regex ? new RegExp(regex, 'i') : null;
  const filters = {
    excludeCategoryFilterRegex: makeRegExp(filterConfig.excludeCategoryFilterRegex),
    includeCategoryFilterRegex: makeRegExp(filterConfig.includeCategoryFilterRegex),
    excludeToolsFilterRegex: makeRegExp(filterConfig.excludeToolsFilterRegex),
    includeToolsFilterRegex: makeRegExp(filterConfig.includeToolsFilterRegex),
  };

  const tools = computed<ToolWithCategory[]>(() => allTools
    .filter((tool) => {
      const category = tool.category || 'Development';
      if (filters.includeToolsFilterRegex?.test(tool.path)) {
        return true;
      }
      if (filters.includeCategoryFilterRegex?.test(category)) {
        return true;
      }
      if (filters.excludeToolsFilterRegex?.test(tool.path)) {
        return false;
      }
      if (filters.excludeCategoryFilterRegex?.test(category)) {
        return false;
      }
      return true;
    })
    .map((tool) => {
      const toolI18nKey = tool.path.replace(/\//g, '');
      const category = tool.category || 'Development';

      return ({
        ...tool,
        path: tool.path,
        name: t(`tools.${toolI18nKey}.title`, tool.name),
        description: t(`tools.${toolI18nKey}.description`, tool.description),
        category: t(`tools.categories.${category.toLowerCase()}`, category),
      });
    }));

  const toolsByCategory = computed<ToolCategory[]>(() => {
    return _.chain(tools.value)
      .orderBy(['category', 'name'], 'asc')
      .groupBy('category')
      .map((components, name, path) => ({
        name,
        path,
        components,
      }))
      .value();
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ name, path }) => name === favoriteName || path === favoriteName))
      .filter(Boolean) as ToolWithCategory[]; // cast because .filter(Boolean) does not remove undefined from type
  });

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    favoriteToolsName,
    newTools: computed(() => tools.value.filter(({ isNew }) => isNew)),

    addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      const toolPath = get(tool).path;
      if (toolPath) {
        favoriteToolsName.value.push(toolPath);
      }
    },

    removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name);
      favoriteToolsName.value = favoriteToolsName.value.filter(name => get(tool).name !== name && get(tool).path !== name);
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(get(tool).name)
        || favoriteToolsName.value.includes(get(tool).path);
    },

    updateFavoriteTools(newOrder: ToolWithCategory[]) {
      favoriteToolsName.value = newOrder.map(tool => tool.path);
    },
  };
});
