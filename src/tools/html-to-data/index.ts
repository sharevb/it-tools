import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-to-data.title'),
  path: '/html-to-data',
  description: t('tools.html-to-data.description'),
  keywords: ['html', 'table', 'excel', 'csv', 'xlsx', 'sql', 'json', 'yaml', 'insert', 'markdown', 'md', 'tsv', 'xml'],
  component: () => import('./html-to-data.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/TableExport')),
  createdAt: new Date('2026-07-04'),
  category: 'Web',
});
