import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML Flattener/Unflattener',
  path: '/yaml-flatten-nestify',
  description: 'Flatten or nestify/unflatten YAML content (ie, a.b: 1 vs a: b: 1)',
  keywords: ['yaml', 'flatten', 'nestify', 'unflatten'],
  component: () => import('./yaml-flatten-nestify.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-07-19'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
