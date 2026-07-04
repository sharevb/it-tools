import { Lock } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pgp-encryption.title'),
  path: '/pgp-encryption',
  description: t('tools.pgp-encryption.description'),
  keywords: ['pgp', 'openpgp', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./pgp-encryption.vue'),
  icon: Lock,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
