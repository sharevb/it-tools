import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.time-alarm.title'),
  path: '/time-alarm',
  description: t('tools.time-alarm.description'),
  keywords: ['time', 'alarm'],
  component: () => import('./time-alarm.vue'),
  icon: Alarm,
  createdAt: new Date('2025-03-09'),
  category: 'Datetime',
});
