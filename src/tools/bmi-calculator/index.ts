import { MedicalCross } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bmi-calculator.title'),
  path: '/bmi-calculator',
  description: translate('tools.bmi-calculator.description'),
  keywords: ['bmi', 'body', 'mass'],
  component: () => import('./bmi-calculator.vue'),
  icon: MedicalCross,
  createdAt: new Date('2025-04-21'),
  category: 'Data',
});
