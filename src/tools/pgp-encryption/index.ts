import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pgp-encryption.title'),
  path: '/pgp-encryption',
  description: t('tools.pgp-encryption.description'),
  keywords: ['pgp', 'openpgp', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./pgp-encryption.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Lock')),
  createdAt: new Date('2024-04-20'),
  category: 'Crypto',
});
