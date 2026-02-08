import { AntennaBars4 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Frequency Converter',
  path: '/frequency-converter',
  description: 'Convert values between frequency units',
  keywords: ['frequency', 'converter',
    'units', 'hz', 'hertz', 'rpm', 'deg/s', 'rad/s',
  ],
  component: () => import('./frequency-converter.vue'),
  icon: AntennaBars4,
  createdAt: new Date('2026-01-30'),
  category: 'Physics',
});
