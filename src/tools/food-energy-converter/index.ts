import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.food-energy-converter.title'),
  path: '/food-energy-converter',
  description: t('tools.food-energy-converter.description'),
  keywords: ['food', 'energy', 'units', 'joule', 'calories'],
  component: () => import('./food-energy-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Crane')),
  createdAt: new Date('2026-03-07'),
  category: 'Physics',
});
