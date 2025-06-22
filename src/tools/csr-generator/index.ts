import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.csr-generator.title'),
  path: '/csr-generator',
  description: translate('tools.csr-generator.description'),
  keywords: ['csr', 'certificate', 'signing', 'request', 'x509', 'generator'],
  component: () => import('./csr-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-02-25'),
  category: 'Crypto',
});
