import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.x509-certificate-generator.title'),
  path: '/x509-certificate-generator',
  description: translate('tools.x509-certificate-generator.description'),
  keywords: ['x509', 'ssl', 'tls', 'self-signed', 'certificate', 'generator'],
  component: () => import('./x509-certificate-generator.vue'),
  icon: FileCertificate,
  createdAt: new Date('2024-02-25'),
  category: 'Crypto',
});
