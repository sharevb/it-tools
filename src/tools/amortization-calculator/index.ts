import { ReportMoney } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.amortization-calculator.title'),
  path: '/amortization-calculator',
  description: t('tools.amortization-calculator.description'),
  keywords: ['amortization', 'calculator'],
  component: () => import('./amortization-calculator.vue'),
  icon: ReportMoney,
  createdAt: new Date('2025-11-22'),
  category: 'Finance',
});
