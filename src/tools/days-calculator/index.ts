import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.days-calculator.title'),
  path: '/days-calculator',
  description: t('tools.days-calculator.description'),
  keywords: ['days', 'date', 'diff', 'interval', 'month', 'year', 'difference', 'holidays', 'calculator'],
  component: () => import('./days-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Calendar')),
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
