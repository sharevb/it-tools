import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.database-connection-string-builder.title'),
  path: '/database-connection-string-builder',
  description: t('tools.database-connection-string-builder.description'),
  keywords: ['database', 'connection', 'builder', 'mysql', 'mongodb', 'sqlserver', 'sqlite', 'postgresql'],
  component: () => import('./database-connection-string-builder.vue'),
  icon: Database,
  createdAt: new Date('2025-10-05'),
  category: 'Development',
});
