import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Tailwind play',
  path: '/tailwind-play',
  description: '',
  keywords: ['tailwind', 'play'],
  component: () => import('./tailwind-play.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-12-04'),
  category: 'Tailwindcss',
});
