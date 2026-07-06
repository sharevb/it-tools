import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.tab-to-spaces.title'),
  path: '/tab-to-spaces',
  description: t('tools.tab-to-spaces.description'),
  keywords: ['tab', 'space'],
  component: () => import('./tab-to-spaces.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/IndentIncrease')),
  createdAt: new Date('2026-02-02'),
  category: 'Text',
});
