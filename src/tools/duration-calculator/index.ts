import { CalendarTime } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.duration-calculator.title'),
  path: '/duration-calculator',
  description: t('tools.duration-calculator.description'),
  keywords: ['duration', 'iso', '8601', 'time', 'calculator', 'units'],
  component: () => import('./duration-calculator.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
