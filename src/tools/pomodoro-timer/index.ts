import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pomodoro-timer.title'),
  path: '/pomodoro-timer',
  description: t('tools.pomodoro-timer.description'),
  keywords: ['pomodoro', 'timer'],
  component: () => import('./pomodoro-timer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/CalendarTime')),
  createdAt: new Date('2025-03-09'),
  category: 'Development',
});
