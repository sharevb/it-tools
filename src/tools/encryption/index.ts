import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.encryption.title'),
  path: '/encryption',
  description: t('tools.encryption.description'),
  keywords: ['cypher', 'encipher', 'text', 'AES', 'TripleDES', 'Rabbit', 'RC4', 'Salsa', 'ChaCha'],
  component: () => import('./encryption.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Lock')),
  redirectFrom: ['/cypher'],
  npmPackages: ['crypto-es', '@noble/ciphers'],
  category: 'Crypto',
});
