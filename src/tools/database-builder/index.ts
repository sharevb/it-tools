import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.database-builder.title'),
  path: '/database-builder',
  description: t('tools.database-builder.description'),
  keywords: ['database', 'create', 'ddl', 'builder', 'mysql', 'mongodb', 'sqlserver', 'sqlite', 'postgresql'],
  component: () => import('./database-builder.vue'),
  icon: Database,
  createdAt: new Date('2026-01-02'),
  category: 'Development',
});
