import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.date-duration-calculator.title'),
  path: '/date-duration-calculator',
  description: translate('tools.date-duration-calculator.description'),
  keywords: ['date', 'duration', 'addition', 'calculator'],
  component: () => import('./date-duration-calculator.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
