import { Dimensions } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS Units Converter',
  path: '/css-units-converter',
  description: 'Convert values from common CSS units (em, rem, px, vw, vh, %)',
  keywords: ['css', 'units', 'converter'],
  component: () => import('./css-units-converter.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-11-29'),
  category: 'Web',
});
