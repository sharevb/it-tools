import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Compose to Quadlets',
  path: '/docker-compose-to-quadlets',
  description: 'Convert Docker compose file content to Podman Quadlets',
  keywords: ['docker', 'compose', 'quadlets'],
  component: () => import('./docker-compose-to-quadlets.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-07-19'),
  category: 'Docker',
});
