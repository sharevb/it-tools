import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON Merger',
  path: '/json-merger',
  description: 'Merge deeply two JSON content',
  keywords: ['json', 'merger'],
  component: () => import('./json-merger.vue'),
  icon: Braces,
  createdAt: new Date('2025-07-19'),
  category: 'JSON',
});
