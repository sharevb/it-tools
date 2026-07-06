import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.database-table-generator.title'),
  path: '/database-table-generator',
  description: t('tools.database-table-generator.description'),
  keywords: ['database', 'table', 'generator', 'mysql', 'mongodb', 'sqlserver', 'sqlite', 'postgresql'],
  component: () => import('./database-table-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Database')),
  createdAt: new Date('2025-12-17'),
  category: 'Development',
});
