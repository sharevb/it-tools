import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-data.title'),
  path: '/json-to-data',
  description: t('tools.json-to-data.description'),
  keywords: ['json', 'excel', 'csv', 'xlsx', 'sql', 'yaml', 'insert', 'markdown', 'md', 'tsv', 'xml'],
  component: () => import('./json-to-data.vue'),
  icon: Braces,
  createdAt: new Date('2025-08-15'),
  category: 'JSON',
});
