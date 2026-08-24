import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.countdown.title'),
  path: '/countdown',
  description: t('tools.countdown.description'),
  keywords: ['countdown'],
  component: () => import('./countdown.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Alarm')),
  createdAt: new Date('2025-03-09'),
  category: 'Datetime',
});
