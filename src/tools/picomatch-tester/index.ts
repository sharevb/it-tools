import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Picomatch Tester',
  path: '/picomatch-tester',
  description: 'A simple tester for the picomatch library, which is used for glob pattern matching.',
  keywords: ['picomatch', 'tester', 'glob', 'pattern', 'matching'],
  component: () => import('./picomatch-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileDiff')),
  createdAt: new Date('2026-07-05'),
  category: 'Development',
});
