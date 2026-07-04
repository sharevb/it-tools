import { CalendarEvent } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ical-parser.title'),
  path: '/ical-parser',
  description: t('tools.ical-parser.description'),
  keywords: ['ical', 'ics', 'calendar', 'parser'],
  component: () => import('./ical-parser.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
