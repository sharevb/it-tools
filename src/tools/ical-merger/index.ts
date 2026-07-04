import { CalendarPlus } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ical-merger.title'),
  path: '/ical-merger',
  description: t('tools.ical-merger.description'),
  keywords: ['ical', 'ics', 'merger'],
  component: () => import('./ical-merger.vue'),
  icon: CalendarPlus,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
