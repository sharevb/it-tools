import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'OpenRouter Model Price Comparison',
  path: '/openrouter-model',
  description: '',
  keywords: ['openrouter', 'model'],
  component: () => import('./openrouter-model.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-11-28'),
  category: 'LLM', // Changed from 'Default' to 'LLM'
});
