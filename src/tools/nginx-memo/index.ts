import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.nginx-memo.title'),
  path: '/nginx-memo',
  description: translate('tools.nginx-memo.description'),
  keywords: ['nginx'],
  component: () => import('./nginx-memo.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
