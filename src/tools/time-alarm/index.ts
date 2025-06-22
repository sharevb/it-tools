import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.time-alarm.title'),
  path: '/time-alarm',
  description: translate('tools.time-alarm.description'),
  keywords: ['time', 'alarm'],
  component: () => import('./time-alarm.vue'),
  icon: Alarm,
  createdAt: new Date('2025-03-09'),
  category: 'Datetime',
});
