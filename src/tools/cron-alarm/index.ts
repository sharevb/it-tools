import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cron-alarm.title'),
  path: '/cron-alarm',
  description: translate('tools.cron-alarm.description'),
  keywords: ['cron', 'week', 'day', 'alarm'],
  component: () => import('./cron-alarm.vue'),
  icon: Alarm,
  createdAt: new Date('2025-04-21'),
  category: 'Datetime',
});
