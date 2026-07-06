import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Running Pace Calculator',
  path: '/running-pace-calculator',
  description: 'Calculate your running pace, estimate your finish times for popular races, break down splits, and find your training zones.',
  keywords: ['running', 'pace', 'calculator'],
  component: () => import('./running-pace-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Run')),
  createdAt: new Date('2026-06-21'),
  category: 'Data',
});
