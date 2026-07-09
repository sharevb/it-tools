import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.fitness-computer.title'),
  path: '/fitness-computer',
  description: t('tools.fitness-computer.description'),
  keywords: ['fitness', 'calories', 'bmi', 'bmr', 'weight', 'fat', 'body', 'fat', 'mass', 'heart'],
  component: () => import('./fitness-computer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Pacman')),
  createdAt: new Date('2026-03-07'),
  category: 'Physics',
});
