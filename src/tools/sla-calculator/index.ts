import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.sla-calculator.title'),
  path: '/sla-calculator',
  description: t('tools.sla-calculator.description'),
  keywords: ['sla', 'service', 'level', 'agreement', 'calculator'],
  component: () => import('./sla-calculator.vue'),
  icon: Clock,
  createdAt: new Date('2024-05-11'),
  category: 'Data',
});
