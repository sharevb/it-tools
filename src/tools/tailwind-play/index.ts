import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Tailwind play',
  path: '/tailwind-play',
  description: 'An online playground for Tailwind CSS, embedded for your convenience.',
  keywords: ['tailwind', 'play'],
  component: () => import('./tailwind-play.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-12-04'),
  category: 'Tailwindcss',
});
