import { translate as t } from '@/plugins/i18n.plugin';
import { IconDatabaseMinus } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.sql-minifier.title'),
  path: '/sql-minifier',
  description: t('tools.sql-minifier.description'),
  keywords: ['sql', 'query', 'minifier'],
  component: () => import('./sql-minifier.vue'),
  icon: IconDatabaseMinus,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
