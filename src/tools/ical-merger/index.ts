import { CalendarPlus } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
