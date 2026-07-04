import { Dimensions } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.levenshtein-calculator.title'),
  path: '/levenshtein-calculator',
  description: t('tools.levenshtein-calculator.description'),
  keywords: ['levenshtein', 'damerau', 'distance', 'calculator'],
  component: () => import('./levenshtein-calculator.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-07-19'),
  category: 'Text',
});
