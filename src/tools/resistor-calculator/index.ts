import { Omega } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.resistor-calculator.title'),
  path: '/resistor-calculator',
  description: t('tools.resistor-calculator.description'),
  keywords: ['resistor', 'ohm', 'calculator'],
  component: () => import('./resistor-calculator.vue'),
  icon: Omega,
  createdAt: new Date('2025-08-15'),
  category: 'Forensic',
});
