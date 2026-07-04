import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.zpool-calculator.title'),
  path: '/zpool-calculator',
  description: t('tools.zpool-calculator.description'),
  keywords: ['zpool', 'raid', 'calculator', 'zfs', 'openzfs'],
  component: () => import('./zpool-calculator.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
});
