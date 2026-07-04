import { DeviceDesktop } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.zpool-memo.title'),
  path: '/zpool-memo',
  description: t('tools.zpool-memo.description'),
  keywords: ['zpool', 'raid', 'cheatsheet', 'zfs', 'openzfs'],
  component: () => import('./zpool-memo.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
});
