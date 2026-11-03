import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.analog-scaling-calculator.title'),
  path: '/analog-scaling-calculator',
  description: t('tools.analog-scaling-calculator.description'),
  keywords: [
    'analog',
    'scaling',
    'raw',
    'plc',
    'siemens',
    '27648',
    'schneider',
    'norm_x',
    'scale_x',
    'engineering',
    'unit',
  ],
  component: () => import('./analog-scaling-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/AdjustmentsHorizontal')),
  createdAt: new Date('2026-11-03'),
  category: 'Automation',
});
