import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pomodoro-timer.title'),
  path: '/pomodoro-timer',
  description: translate('tools.pomodoro-timer.description'),
  keywords: ['pomodoro', 'timer'],
  component: () => import('./pomodoro-timer.vue'),
  icon: CalendarTime,
  createdAt: new Date('2025-03-09'),
  category: 'Development',
});
