import { translate as t } from '@/plugins/i18n.plugin';
import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.explainshell.title'),
  path: '/explainshell',
  description: t('tools.explainshell.description'),
  keywords: ['explain', 'shell'],
  component: () => import('./explainshell.vue'),
  icon: Terminal2,
  createdAt: new Date('2026-01-30'),
  category: 'Data',
  externAccessDescription: t('tools.explainshell.externalAccess'),
});
