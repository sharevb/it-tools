import { CalendarEvent } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ical-generator.title'),
  path: '/ical-generator',
  description: t('tools.ical-generator.description'),
  keywords: ['ical', 'calendar', 'event', 'generator'],
  component: () => import('./ical-generator.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
