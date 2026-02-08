import { Speedboat } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Speed Converter',
  path: '/speed-converter',
  description: 'Convert values between speed units',
  keywords: ['speed', 'converter',
    'units', 'm/s', 'km/h', 'm/h', 'knot', 'ft/s',
  ],
  component: () => import('./speed-converter.vue'),
  icon: Speedboat,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
