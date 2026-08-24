import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.markdown-to-data.title'),
  path: '/markdown-to-data',
  description: t('tools.markdown-to-data.description'),
  keywords: ['markdown', 'table', 'excel', 'csv', 'xlsx', 'sql', 'json', 'yaml', 'insert', 'md', 'tsv', 'xml'],
  component: () => import('./markdown-to-data.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/TableExport')),
  createdAt: new Date('2026-07-04'),
  category: 'Markdown',
});
