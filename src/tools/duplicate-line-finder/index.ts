import { ListSearch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.duplicate-line-finder.title'),
  path: '/duplicate-line-finder',
  description: translate('tools.duplicate-line-finder.description'),
  keywords: ['duplicate', 'line', 'finder'],
  component: () => import('./duplicate-line-finder.vue'),
  icon: ListSearch,
  createdAt: new Date('2025-03-09'),
  category: 'Text',
});
