import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Compose to .env file',
  path: '/docker-compose-to-env-file',
  description: 'Extract .env file from an existing Docker Compose file',
  keywords: ['docker', 'compose', 'env', 'environment'],
  component: () => import('./docker-compose-to-env-file.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-11-11'),
  category: 'Docker',
});
