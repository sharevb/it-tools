import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ed25519-key-pair-generator.title'),
  path: '/ed25519-key-pair-generator',
  description: translate('tools.ed25519-key-pair-generator.description'),
  keywords: ['ed25519', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./ed25519-key-pair-generator.vue'),
  icon: Certificate,
  createdAt: new Date('2024-02-14'),
  category: 'Crypto',
});
