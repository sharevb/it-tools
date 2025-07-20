import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML Merger',
  path: '/yaml-merger',
  description: 'Merge deeply two YAML content',
  keywords: ['yaml', 'merger'],
  component: () => import('./yaml-merger.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-07-19'),
  npmPackages: ['yaml'],
  category: 'YAML',
});
