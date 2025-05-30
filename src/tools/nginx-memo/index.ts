import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Nginx Cheatsheet',
  path: '/nginx-memo',
  description: 'Nginx configuration and useful commands',
  keywords: ['nginx'],
  component: () => import('./nginx-memo.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2025-05-08'),
  category: 'Cheatsheets',
});
