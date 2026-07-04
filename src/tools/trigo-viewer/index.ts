import { MathFunction } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.trigo-viewer.title'),
  path: '/trigo-viewer',
  description: t('tools.trigo-viewer.description'),
  keywords: ['trigonometry', 'equation', 'curve', 'visualizer'],
  component: () => import('./trigo-viewer.vue'),
  icon: MathFunction,
  createdAt: new Date('2025-12-13'),
  category: 'Maths',
});
