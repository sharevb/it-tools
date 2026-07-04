import { CalendarStats } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.which-day.title'),
  path: '/which-day',
  description: t('tools.which-day.description'),
  keywords: ['which', 'weekday', 'date', 'year', 'day'],
  component: () => import('./which-day.vue'),
  icon: CalendarStats,
  createdAt: new Date('2025-08-23'),
  category: 'Datetime',
});
