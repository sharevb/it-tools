import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.countdown.title'),
  path: '/countdown',
  description: translate('tools.countdown.description'),
  keywords: ['countdown'],
  component: () => import('./countdown.vue'),
  icon: Alarm,
  createdAt: new Date('2025-03-09'),
  category: 'Datetime',
});
