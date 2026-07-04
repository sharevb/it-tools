import { CompareArrowsRound } from '@vicons/material';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-diff.title'),
  path: '/json-diff',
  description: t('tools.json-diff.description'),
  keywords: ['json', 'diff', 'compare', 'difference', 'object', 'data'],
  component: () => import('./json-diff.vue'),
  icon: CompareArrowsRound,
  createdAt: new Date('2023-04-20'),
  npmPackages: ['json5'],
  category: 'JSON',
});
