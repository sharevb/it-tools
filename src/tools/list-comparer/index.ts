import { List } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.list-comparer.title'),
  path: '/list-comparer',
  description: t('tools.list-comparer.description'),
  keywords: ['list', 'comparer'],
  component: () => import('./list-comparer.vue'),
  icon: List,
  createdAt: new Date('2024-08-15'),
  category: 'Text',
});
