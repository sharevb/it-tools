import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.amortization-calculator.title'),
  path: '/amortization-calculator',
  description: t('tools.amortization-calculator.description'),
  keywords: ['amortization', 'calculator'],
  component: () => import('./amortization-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ReportMoney')),
  createdAt: new Date('2025-11-22'),
  category: 'Finance',
});
