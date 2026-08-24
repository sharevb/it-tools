import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ping.title'),
  path: '/ping',
  description: t('tools.ping.description'),
  keywords: ['ping'],
  component: () => import('./ping.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/DoorEnter')),
  createdAt: new Date('2026-07-12'),
  category: 'Network',
  externAccessDescription: t('tools.ping.externalAccess'),
});
