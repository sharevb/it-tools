import { TableExport } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.excel-to-data.title'),
  path: '/excel-to-data',
  description: t('tools.excel-to-data.description'),
  keywords: ['excel', 'csv', 'xlsx', 'sql', 'json', 'yaml', 'insert', 'markdown', 'md', 'tsv', 'xml'],
  component: () => import('./excel-to-data.vue'),
  icon: TableExport,
  createdAt: new Date('2024-12-25'),
  category: 'Converters',
});
