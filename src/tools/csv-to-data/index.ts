import { TableExport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.csv-to-data.title'),
  path: '/csv-to-data',
  description: translate('tools.csv-to-data.description'),
  keywords: ['excel', 'csv', 'xlsx', 'sql', 'json', 'yaml', 'insert', 'markdown', 'md', 'tsv', 'xml'],
  component: () => import('./csv-to-data.vue'),
  icon: TableExport,
  createdAt: new Date('2025-05-01'),
  redirectFrom: ['/csv-to-json'],
  category: 'Converters',
});
