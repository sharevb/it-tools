import { List } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-csv.title'),
  path: '/json-to-csv',
  description: t('tools.json-to-csv.description'),
  keywords: ['json', 'to', 'csv', 'convert'],
  component: () => import('./json-to-csv.vue'),
  icon: List,
  createdAt: new Date('2023-06-18'),
  npmPackages: ['json5'],
  category: 'JSON',
});
