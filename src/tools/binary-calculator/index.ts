import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.binary-calculator.title'),
  path: '/binary-calculator',
  description: t('tools.binary-calculator.description'),
  keywords: ['binary', 'and', 'or', 'xor', 'not', 'bitwise', 'calculator'],
  component: () => import('./binary-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2025-11-11'),
  category: 'Maths',
});
