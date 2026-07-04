import { ArrowsSort } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-sort-master.title'),
  path: '/json-sort-master',
  description: t('tools.json-sort-master.description'),
  keywords: ['json', 'sort'],
  component: () => import('./json-sort-master.vue'),
  icon: ArrowsSort,
  createdAt: new Date('2024-03-27'),
  category: 'JSON',
});
