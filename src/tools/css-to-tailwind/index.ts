import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS to tailwind',
  path: '/css-to-tailwind',
  description: '',
  keywords: ['css', 'converter', 'tailwind'],
  component: () => import('./css-to-tailwind.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-12-05'),
  category: 'Tailwindcss',
});
