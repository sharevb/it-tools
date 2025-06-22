import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pgp-keygen.title'),
  path: '/pgp-key-pair-generator',
  description: translate('tools.pgp-keygen.description'),
  keywords: ['pgp', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./pgp-keygen.vue'),
  icon: Certificate,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
