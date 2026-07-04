import { Calendar } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.date-duration-calculator.title'),
  path: '/date-duration-calculator',
  description: t('tools.date-duration-calculator.description'),
  keywords: ['date', 'duration', 'addition', 'calculator', 'units'],
  component: () => import('./date-duration-calculator.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
