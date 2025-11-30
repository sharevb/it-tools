import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown Lorem Ipsum',
  path: '/markdown-lorem-ipsum',
  description: 'Generate Lorem Ipsum in markdown',
  keywords: ['markdown', 'lorem', 'ipsum'],
  component: () => import('./markdown-lorem-ipsum.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-11-29'),
  category: 'Markdown',
});
