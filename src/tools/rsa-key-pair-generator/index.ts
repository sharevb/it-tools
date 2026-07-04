import { Certificate } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rsa-key-pair-generator.title'),
  path: '/rsa-key-pair-generator',
  description: 'Generate new random RSA private and public keys (with or without passphrase).',
  keywords: ['rsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./rsa-key-pair-generator.vue'),
  icon: Certificate,
  npmPackages: ['node-forge'],
  category: 'Crypto',
});
