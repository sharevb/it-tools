import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Tailwind colors',
  path: '/tailwind-colors',
  description: 'A handy tool to browse, pick, and copy colors from the Tailwind CSS palette.',
  keywords: ['tailwind', 'colors'],
  component: () => import('./tailwind-colors.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-12-04'),
  category: 'Tailwindcss',
});
