import { ShieldChevron } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ssl-cert-converter.title'),
  path: '/ssl-cert-converter',
  description: translate('tools.ssl-cert-converter.description'),
  keywords: ['ssl', 'certificate', 'crt', 'pkcs', 'p12', 'pem', 'der', 'jks', 'converter'],
  component: () => import('./ssl-cert-converter.vue'),
  icon: ShieldChevron,
  createdAt: new Date('2024-08-15'),
  category: 'Crypto',
});
