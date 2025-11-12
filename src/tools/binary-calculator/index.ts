import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Binary Calculator',
  path: '/binary-calculator',
  description: 'Calculate bitwise/binary operations (AND, OR, XOR, NOT, shifts) between two numbers',
  keywords: ['binary', 'and', 'or', 'xor', 'not', 'bitwise', 'calculator'],
  component: () => import('./binary-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2025-11-11'),
  category: 'Maths',
});
