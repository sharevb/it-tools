import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.x509-certificate-generator.title'),
  path: '/x509-certificate-generator',
  description: t('tools.x509-certificate-generator.description'),
  keywords: ['x509', 'ssl', 'tls', 'self-signed', 'certificate', 'generator'],
  component: () => import('./x509-certificate-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileCertificate')),
  createdAt: new Date('2024-02-25'),
  category: 'Crypto',
});
