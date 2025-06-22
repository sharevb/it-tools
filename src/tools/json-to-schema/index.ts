import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-schema.title'),
  path: '/json-to-schema',
  description: translate('tools.json-to-schema.description'),
  keywords: ['json', 'schema', 'mysql', 'sql', 'ddl', 'mongoose', 'bigquery', 'clickhouse', 'table'],
  component: () => import('./json-to-schema.vue'),
  icon: Braces,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
