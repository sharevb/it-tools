import { ReceiptTax } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.vat-validator.title'),
  path: '/vat-validator',
  description: t('tools.vat-validator.description'),
  keywords: ['vat', 'validator'],
  component: () => import('./vat-validator.vue'),
  icon: ReceiptTax,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
