import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.barcode-reader.title'),
  path: '/barcode-reader',
  description: translate('tools.barcode-reader.description'),
  keywords: ['barcode', 'reader'],
  component: () => import('./barcode-reader.vue'),
  icon: Barcode,
  createdAt: new Date('2024-04-20'),
  category: 'Barcodes',
});
