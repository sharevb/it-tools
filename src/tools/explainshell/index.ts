import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';
import { getToolsSettingString } from '@/utils/tools-settings';

export const tool = defineTool({
  name: t('tools.explainshell.title'),
  path: '/explainshell',
  description: t('tools.explainshell.description'),
  keywords: ['explain', 'shell'],
  component: () => import('./explainshell.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Terminal2')),
  createdAt: new Date('2026-01-30'),
  category: 'Data',
  externAccessDescription: t('tools.explainshell.externalAccess'),
  requiresInternet: (settings) => !getToolsSettingString(settings, 'explainchain', 'url'),
});
