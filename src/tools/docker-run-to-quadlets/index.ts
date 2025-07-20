import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker run to Quadlets',
  path: '/docker-run-to-quadlets',
  description: 'Convert docker run commands to Podman Quadlets',
  keywords: ['docker', 'run', 'podman', 'quadlets'],
  component: () => import('./docker-run-to-quadlets.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-07-19'),
  category: 'Docker',
});
