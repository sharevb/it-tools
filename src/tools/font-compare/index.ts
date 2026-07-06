import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.font-compare.title'),
  path: '/font-compare',
  description: t('tools.font-compare.description'),
  keywords: ['font', 'ttf', 'otf', 'compare'],
  component: () => import('./font-compare.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/GitCompare')),
  createdAt: new Date('2025-08-15'),
  category: 'Text',
});
