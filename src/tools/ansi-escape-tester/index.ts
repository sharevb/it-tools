import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ANSI Escape Tester',
  path: '/ansi-escape-tester',
  description: 'Create and test ANSI console escape sequences',
  keywords: ['ansi', 'escape', 'tester'],
  component: () => import('./ansi-escape-tester.vue'),
  icon: Terminal2,
  createdAt: new Date('2025-07-06'),
  category: 'Development',
});
