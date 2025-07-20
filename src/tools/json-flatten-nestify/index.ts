import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON Flattener/Unflattener',
  path: '/json-flatten-nestify',
  description: 'Flatten or nestify/unflatten JSON content (ie, {a:{b:1}} vs {"a.b":1}',
  keywords: ['json', 'flatten', 'nestify', 'unflatten'],
  component: () => import('./json-flatten-nestify.vue'),
  icon: Braces,
  createdAt: new Date('2025-07-19'),
  category: 'JSON',
});
