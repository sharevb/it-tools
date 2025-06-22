import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.sql-minifier.title'),
  path: '/sql-minifier',
  description: translate('tools.sql-minifier.description'),
  keywords: ['sql', 'query', 'minifier'],
  component: () => import('./sql-minifier.vue'),
  icon: Database,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
