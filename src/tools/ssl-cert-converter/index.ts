import { ShieldChevron } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ssl-cert-converter.title'),
  path: '/ssl-cert-converter',
  description: t('tools.ssl-cert-converter.description'),
  keywords: ['ssl', 'certificate', 'crt', 'pkcs', 'p12', 'pem', 'der', 'jks', 'converter'],
  component: () => import('./ssl-cert-converter.vue'),
  icon: ShieldChevron,
  createdAt: new Date('2024-08-15'),
  category: 'Crypto',
});
