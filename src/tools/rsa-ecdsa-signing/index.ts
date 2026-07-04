import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.rsa-ecdsa-signing.title'),
  path: '/rsa-ecdsa-signing',
  description: t('tools.rsa-ecdsa-signing.description'),
  keywords: ['rsa', 'dsa', 'ecdsa', 'ed25519', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./rsa-ecdsa-signing.vue'),
  icon: Lock,
  createdAt: new Date('2024-05-01'),
  category: 'Crypto',
});
