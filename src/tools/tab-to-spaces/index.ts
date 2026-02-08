import { IndentIncrease } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Tab to Spaces',
  path: '/tab-to-spaces',
  description: 'Convert tab to multiple spaces',
  keywords: ['tab', 'space'],
  component: () => import('./tab-to-spaces.vue'),
  icon: IndentIncrease,
  createdAt: new Date('2026-02-02'),
  category: 'Text',
});
