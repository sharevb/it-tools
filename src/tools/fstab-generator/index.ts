import { DeviceFloppy } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.fstab-generator.title'),
  path: '/fstab-generator',
  description: t('tools.fstab-generator.description'),
  keywords: ['fstab', 'etc'],
  component: () => import('./fstab-generator.vue'),
  icon: DeviceFloppy,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
