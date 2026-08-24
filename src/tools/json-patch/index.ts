import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json Patch Tester',
  path: '/json-patch',
  description:
    'A simple tool for creating and testing JSON patches according to RFC 6902. And list paths of a JSON object.',
  keywords: ['json', 'patch', 'rfc6902', 'path'],
  component: () => import('./json-patch.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileDiff')),
  createdAt: new Date('2026-07-05'),
  category: 'JSON',
});
