import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.qr-contact-info-generator.title'),
  path: '/qr-contact-info-generator',
  description: t('tools.qr-contact-info-generator.description'),
  keywords: ['qr', 'contact', 'vcard', 'generator', 'business', 'networking'],
  component: () => import('./qr-contact-info-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2025-03-09'),
  category: 'Barcodes',
});
