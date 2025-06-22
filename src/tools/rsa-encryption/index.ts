import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.rsa-encryption.title'),
  path: '/rsa-encryption',
  description: translate('tools.rsa-encryption.description'),
  keywords: ['rsa', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./rsa-encryption.vue'),
  icon: Lock,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
