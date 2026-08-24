import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-table-generator.title'),
  path: '/markdown-table-generator',
  description: t('tools.markdown-table-generator.description'),
  keywords: ['markdown', 'table', 'generator', 'gfm', 'github'],
  component: () => import('./markdown-table-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Table')),
  createdAt: new Date('2026-07-11'),
  category: 'Markdown',
});
