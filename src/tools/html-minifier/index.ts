import { BrandHtml5 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML Minifier',
  path: '/html-minifier',
  description: 'Minify HTML content',
  keywords: ['html', 'minifier'],
  component: () => import('./html-minifier.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2025-07-06'),
  category: 'Web',
});
