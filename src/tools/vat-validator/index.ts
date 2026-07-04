import { ReceiptTax } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

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
