import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dead pixel',
  path: '/dead-pixel',
  description:
    'Tool to check if a pixel on your screen is dead or not.',
  keywords: ['dead', 'pixel'],
  component: () => import('./dead-pixel.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2026-01-02'),
  category: 'Forensic',
});
