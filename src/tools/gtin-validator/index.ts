import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.gtin-validator.title'),
  path: '/gtin-validator',
  description: t('tools.gtin-validator.description'),
  keywords: ['gtin', 'validator', 'ean', 'trade', 'identifier'],
  component: () => import('./gtin-validator.vue'),
  icon: Barcode,
  createdAt: new Date('2025-10-03'),
  category: 'Barcodes',
});
