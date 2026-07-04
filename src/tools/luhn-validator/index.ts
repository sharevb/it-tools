import { Check } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.luhn-validator.title'),
  path: '/luhn-validator',
  description: t('tools.luhn-validator.description'),
  keywords: ['luhn', 'credit-card', 'imei', 'identifier', 'validator'],
  component: () => import('./luhn-validator.vue'),
  icon: Check,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
