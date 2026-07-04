import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.qr-code-decoder.title'),
  path: '/qr-code-decoder',
  description: t('tools.qr-code-decoder.description'),
  keywords: ['qrcode', 'qr-code', 'decoder', 'reader', 'wifi', 'otp', 'parser'],
  component: () => import('./qr-code-decoder.vue'),
  icon: Qrcode,
  createdAt: new Date('2024-09-01'),
  category: 'Barcodes',
});
