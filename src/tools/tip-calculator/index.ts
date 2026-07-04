import { Calculator } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.tip-calculator.title'),
  path: '/tip-calculator',
  description: t('tools.tip-calculator.description'),
  keywords: ['tip', 'calculator', 'bill', 'split', 'restaurant', 'money', 'payment'],
  component: () => import('./tip-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2024-04-17'),
  category: 'Maths',
});
