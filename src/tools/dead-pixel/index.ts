import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.dead-pixel.title'),
  path: '/dead-pixel',
  description: t('tools.dead-pixel.description'),
  keywords: ['dead', 'pixel'],
  component: () => import('./dead-pixel.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/DeviceDesktop')),
  createdAt: new Date('2026-01-02'),
  category: 'Forensic',
});
