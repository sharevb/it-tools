import { Check } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.luhn-validator.title'),
  path: '/luhn-validator',
  description: translate('tools.luhn-validator.description'),
  keywords: ['luhn', 'credit-card', 'imei', 'identifier', 'validator'],
  component: () => import('./luhn-validator.vue'),
  icon: Check,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
