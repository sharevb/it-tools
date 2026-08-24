import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.duplicate-line-finder.title'),
  path: '/duplicate-line-finder',
  description: t('tools.duplicate-line-finder.description'),
  keywords: ['duplicate', 'line', 'finder'],
  component: () => import('./duplicate-line-finder.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ListSearch')),
  createdAt: new Date('2025-03-09'),
  category: 'Text',
});
