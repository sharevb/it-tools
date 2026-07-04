import { Certificate } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ecdsa-key-pair-generator.title'),
  path: '/ecdsa-key-pair-generator',
  description: t('tools.ecdsa-key-pair-generator.description'),
  keywords: ['ecdsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./ecdsa-key-pair-generator.vue'),
  icon: Certificate,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
