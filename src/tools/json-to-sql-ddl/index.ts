import { Database } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-sql-ddl.title'),
  path: '/json-to-sql-ddl',
  description: t('tools.json-to-sql-ddl.description'),
  keywords: ['json', 'sql', 'ddl', 'create', 'table'],
  component: () => import('./json-to-sql-ddl.vue'),
  icon: Database,
  createdAt: new Date('2025-03-09'),
  category: 'JSON',
});
