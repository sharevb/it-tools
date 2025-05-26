import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Cron/Weekday Alarm',
  path: '/cron-alarm',
  description: 'Alarm based on time and weekdays expression',
  keywords: ['cron', 'week', 'day', 'alarm'],
  component: () => import('./cron-alarm.vue'),
  icon: Alarm,
  createdAt: new Date('2025-04-21'),
  category: 'Datetime',
});
