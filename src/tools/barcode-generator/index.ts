import { Barcode } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.barcode-generator.title'),
  path: '/barcode-generator',
  description: t('tools.barcode-generator.description'),
  keywords: ['barcode', 'generator'],
  component: () => import('./barcode-generator.vue'),
  icon: Barcode,
  createdAt: new Date('2024-04-20'),
  category: 'Barcodes',
});
