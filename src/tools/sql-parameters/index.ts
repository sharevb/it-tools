import { translate as t } from '@/plugins/i18n.plugin';
import { IconDatabaseCog } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.sql-parameters.title'),
  path: '/sql-parameters',
  description: t('tools.sql-parameters.description'),
  keywords: ['sql', 'select', 'insert', 'parameters'],
  component: () => import('./sql-parameters.vue'),
  icon: IconDatabaseCog,
  createdAt: new Date('2025-08-15'),
  category: 'Development',
});
