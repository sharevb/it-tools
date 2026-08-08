import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.xml-diff.title'),
  path: '/xml-diff',
  description: t('tools.xml-diff.description'),
  keywords: ['xml', 'diff', 'compare', 'difference'],
  component: () => import('./xml-diff.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/CompareArrowsRound')),
  createdAt: new Date('2026-11-22'),
  category: 'XML',
});
