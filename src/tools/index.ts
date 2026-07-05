import markdownit from 'markdown-it';
import { IconExternalLink } from '@tabler/icons-vue';
import type { ExternalTool, ToolCategory, ToolWithCategory, ToolsFilter } from './tools.types';
import { translate as t } from '@/plugins/i18n.plugin';

const modules = import.meta.glob<true, string, ToolWithCategory>('./*/index.ts', { eager: true, import: 'tool' });

const base = import.meta.env.BASE_URL ?? '/';
let filterConfig: ToolsFilter = {};
try {
  const remoteConfigResponse = await fetch(`${base}tools-filter.json`);
  if (remoteConfigResponse.ok) {
    filterConfig = (await remoteConfigResponse.json()) as ToolsFilter;
  }
}
catch {}

let allModules: ToolWithCategory[] = Object.values(modules);
try {
  const remoteConfigResponse = await fetch(`${base}external-tools.json`);
  if (remoteConfigResponse.ok) {
    allModules = [
      ...allModules,
      ...((await remoteConfigResponse.json()) as ExternalTool[])
        .map((externalTool) => {
          const html = markdownit().render(externalTool.markdownContent
              || (externalTool.href
                ? `${t('tools.external-link-goto')} [${externalTool.href}](${externalTool.href})`
                : ''));
          return ({
            icon: IconExternalLink,
            ...externalTool,
            component: () => import('@/components/ExternalToolContent.vue'),
            externalHTMLContent: html,
          }) as ToolWithCategory;
        })];
  }
}
catch {}

const makeRegExp = (regex: string | undefined) => regex ? new RegExp(regex, 'i') : null;
const filters = {
  excludeCategoryFilterRegex: makeRegExp(filterConfig.excludeCategoryFilterRegex),
  includeCategoryFilterRegex: makeRegExp(filterConfig.includeCategoryFilterRegex),
  excludeToolsFilterRegex: makeRegExp(filterConfig.excludeToolsFilterRegex),
  includeToolsFilterRegex: makeRegExp(filterConfig.includeToolsFilterRegex),
};

const filteredModules = allModules.filter((tool) => {
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
});

export const toolsByCategory = filteredModules.reduce((la, moduleDef) => {
  let found = la.find(l => l.name === moduleDef.category);
  if (!found) {
    found = {
      name: moduleDef.category,
      components: [],
    };
    la.push(found);
  }
  found.components.push(moduleDef);
  return la;
}, [] as ToolCategory[]);

export const tools = toolsByCategory.flatMap(({ components }) => components);
