import { DeviceDesktop } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.nginx-memo.title'),
  path: '/nginx-memo',
  description: t('tools.nginx-memo.description'),
  keywords: ['nginx'],
  component: () => import('./nginx-memo.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
