import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json Query',
  path: '/json-query',
  description: 'Run JSON Query lang on a given JSON content',
  keywords: ['json', 'query', 'jsonquery', 'lang'],
  component: () => import('./json-query.vue'),
  icon: Braces,
  createdAt: new Date('2025-07-06'),
  category: 'JSON',
});
