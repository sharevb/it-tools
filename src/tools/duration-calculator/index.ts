import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.duration-calculator.title'),
  path: '/duration-calculator',
  description: translate('tools.duration-calculator.description'),
  keywords: ['duration', 'iso', '8601', 'time', 'calculator'],
  component: () => import('./duration-calculator.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
