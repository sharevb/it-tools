import { Lock } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rsa-encryption.title'),
  path: '/rsa-encryption',
  description: t('tools.rsa-encryption.description'),
  keywords: ['rsa', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./rsa-encryption.vue'),
  icon: Lock,
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
