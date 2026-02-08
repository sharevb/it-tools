import { Wind } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Volume Flow Rate Converter',
  path: '/volume-flow-rate-converter',
  description: 'Convert values between volume flow rate units',
  keywords: ['volume', 'flow', 'rate', 'converter',
    'units', 'm3/s', 'l/s', 'tsp/s', 'in3/s', 'fl-oz/s', 'gal/s', 'ft3/s', 'yd3/s',
  ],
  component: () => import('./volume-flow-rate-converter.vue'),
  icon: Wind,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
