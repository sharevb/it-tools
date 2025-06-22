import { DatabaseExport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-sql-insert.title'),
  path: '/json-to-sql-insert',
  description: translate('tools.json-to-sql-insert.description'),
  keywords: ['json', 'sql', 'insert'],
  component: () => import('./json-to-sql-insert.vue'),
  icon: DatabaseExport,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
