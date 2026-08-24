import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.date-duration-calculator.title'),
  path: '/date-duration-calculator',
  description: t('tools.date-duration-calculator.description'),
  keywords: ['date', 'duration', 'addition', 'calculator', 'units'],
  component: () => import('./date-duration-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Calendar')),
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
