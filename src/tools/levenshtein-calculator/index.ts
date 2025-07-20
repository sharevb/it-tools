import { Dimensions } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Levenshtein Calculator',
  path: '/levenshtein-calculator',
  description: 'Compute Levenshtein distance and scores between to strings',
  keywords: ['levenshtein', 'damerau', 'distance', 'calculator'],
  component: () => import('./levenshtein-calculator.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-07-19'),
  category: 'Text',
});
