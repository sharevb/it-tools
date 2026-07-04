import { Braces } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-schema.title'),
  path: '/json-to-schema',
  description: t('tools.json-to-schema.description'),
  keywords: ['json', 'schema', 'mysql', 'sql', 'ddl', 'mongoose', 'bigquery', 'clickhouse', 'table'],
  component: () => import('./json-to-schema.vue'),
  icon: Braces,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
