import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.sla-calculator.title'),
  path: '/sla-calculator',
  description: translate('tools.sla-calculator.description'),
  keywords: ['sla', 'service', 'level', 'agreement', 'calculator'],
  component: () => import('./sla-calculator.vue'),
  icon: Clock,
  createdAt: new Date('2024-05-11'),
  category: 'Data',
});
