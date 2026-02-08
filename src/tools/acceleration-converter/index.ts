import { Run } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Acceleration Converter',
  path: '/acceleration-converter',
  description: 'Convert values between acceleration units',
  keywords: ['acceleration', 'converter',
    'units', 'g (g-force)', 'm/s2',
  ],
  component: () => import('./acceleration-converter.vue'),
  icon: Run,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
