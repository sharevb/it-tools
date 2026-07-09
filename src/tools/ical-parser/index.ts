import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ical-parser.title'),
  path: '/ical-parser',
  description: t('tools.ical-parser.description'),
  keywords: ['ical', 'ics', 'calendar', 'parser'],
  component: () => import('./ical-parser.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/CalendarEvent')),
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
