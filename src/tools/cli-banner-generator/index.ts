import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CLI Banner Generator',
  path: '/cli-banner-generator',
  description: 'Generate ASCII banners, Message of the Day (MOTD) for your CLI applications, terminal or router.',
  keywords: ['cli', 'banner', 'generator', 'ascii', 'logo'],
  component: () => import('./cli-banner-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Terminal2')),
  createdAt: new Date('2026-11-15'),
  category: 'Text',
});
