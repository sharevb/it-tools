import { SunOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Shutdown Command Generator',
  path: '/shutdown-command-generator',
  description: 'Generate shutdown command for various OS',
  keywords: ['shutdown', 'command'],
  component: () => import('./shutdown-command-generator.vue'),
  icon: SunOff,
  createdAt: new Date('2026-04-07'),
  category: 'Network',
});
