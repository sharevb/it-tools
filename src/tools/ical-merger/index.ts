import { CalendarPlus } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ical-merger.title'),
  path: '/ical-merger',
  description: translate('tools.ical-merger.description'),
  keywords: ['ical', 'ics', 'merger'],
  component: () => import('./ical-merger.vue'),
  icon: CalendarPlus,
  createdAt: new Date('2024-08-15'),
  category: 'Datetime',
});
