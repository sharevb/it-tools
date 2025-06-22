import { CalendarEvent } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ical-parser.title'),
  path: '/ical-parser',
  description: translate('tools.ical-parser.description'),
  keywords: ['ical', 'ics', 'calendar', 'parser'],
  component: () => import('./ical-parser.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
