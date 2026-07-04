import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.barcode-reader.title'),
  path: '/barcode-reader',
  description: t('tools.barcode-reader.description'),
  keywords: ['barcode', 'reader'],
  component: () => import('./barcode-reader.vue'),
  icon: Barcode,
  createdAt: new Date('2024-04-20'),
  category: 'Barcodes',
});
