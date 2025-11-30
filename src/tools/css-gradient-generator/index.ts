import { Rainbow } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS Gradient Generator',
  path: '/css-gradient-generator',
  description: 'Generate CSS Gradient css code for a given set of steps and colors',
  keywords: ['css', 'gradient', 'generator'],
  component: () => import('./css-gradient-generator.vue'),
  icon: Rainbow,
  createdAt: new Date('2025-11-29'),
  category: 'Web',
});
