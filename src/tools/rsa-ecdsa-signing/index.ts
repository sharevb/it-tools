import { Lock } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
