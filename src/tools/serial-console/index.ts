import { DeviceAnalytics } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Serial Port Console',
  path: '/serial-console',
  description: 'Connect, read and send message to Serial Port',
  keywords: ['serial', 'port', 'console'],
  component: () => import('./serial-console.vue'),
  icon: DeviceAnalytics,
  createdAt: new Date('2025-11-11'),
  category: 'Forensic',
});
