import { GitCompare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-comparer.title'),
  path: '/image-comparer',
  description: t('tools.image-comparer.description'),
  keywords: ['image', 'comparer'],
  component: () => import('./image-comparer.vue'),
  icon: GitCompare,
  createdAt: new Date('2025-08-15'),
  category: 'Images',
});
