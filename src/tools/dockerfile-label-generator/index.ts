import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dockerfile Label Generator',
  path: '/dockerfile-label-generator',
  description: 'A simple tool for generating labels for Dockerfiles.',
  keywords: ['dockerfile', 'label', 'generator'],
  component: () => import('./dockerfile-label-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandDocker')),
  createdAt: new Date('2026-07-05'),
  category: 'Docker',
});
