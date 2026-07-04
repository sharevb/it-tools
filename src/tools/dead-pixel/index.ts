import { DeviceDesktop } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dead-pixel.title'),
  path: '/dead-pixel',
  description: t('tools.dead-pixel.description'),
  keywords: ['dead', 'pixel'],
  component: () => import('./dead-pixel.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2026-01-02'),
  category: 'Forensic',
});
