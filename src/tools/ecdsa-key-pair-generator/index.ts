import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ecdsa-key-pair-generator.title'),
  path: '/ecdsa-key-pair-generator',
  description: translate('tools.ecdsa-key-pair-generator.description'),
  keywords: ['ecdsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./ecdsa-key-pair-generator.vue'),
  icon: Certificate,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
