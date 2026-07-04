import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.week-number-converter.title'),
  path: '/week-number-converter',
  description: t('tools.week-number-converter.description'),
  keywords: ['week', 'month', 'number', 'iso', 'converter'],
  component: () => import('./week-number-converter.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
