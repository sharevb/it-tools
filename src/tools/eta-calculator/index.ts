import { Hourglass } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.eta-calculator.title'),
  path: '/eta-calculator',
  description: t('tools.eta-calculator.description'),
  keywords: ['eta', 'calculator', 'estimated', 'time', 'arrival', 'average'],
  component: () => import('./eta-calculator.vue'),
  icon: Hourglass,
  category: 'Datetime',
});
