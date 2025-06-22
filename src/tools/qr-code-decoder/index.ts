import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.qr-code-decoder.title'),
  path: '/qr-code-decoder',
  description: translate('tools.qr-code-decoder.description'),
  keywords: ['qrcode', 'qr-code', 'decoder', 'reader'],
  component: () => import('./qr-code-decoder.vue'),
  icon: Qrcode,
  createdAt: new Date('2024-09-01'),
  category: 'Barcodes',
});
