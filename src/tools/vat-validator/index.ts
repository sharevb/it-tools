import { ReceiptTax } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.vat-validator.title'),
  path: '/vat-validator',
  description: translate('tools.vat-validator.description'),
  keywords: ['vat', 'validator'],
  component: () => import('./vat-validator.vue'),
  icon: ReceiptTax,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
