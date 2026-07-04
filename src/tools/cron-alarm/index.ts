import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.cron-alarm.title'),
  path: '/cron-alarm',
  description: t('tools.cron-alarm.description'),
  keywords: ['cron', 'week', 'day', 'alarm'],
  component: () => import('./cron-alarm.vue'),
  icon: Alarm,
  createdAt: new Date('2025-04-21'),
  category: 'Datetime',
});
