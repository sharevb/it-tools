import { Lock } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.encryption.title'),
  path: '/encryption',
  description: t('tools.encryption.description'),
  keywords: ['cypher', 'encipher', 'text', 'AES', 'TripleDES', 'Rabbit', 'RC4', 'Salsa', 'ChaCha'],
  component: () => import('./encryption.vue'),
  icon: Lock,
  redirectFrom: ['/cypher'],
  npmPackages: ['crypto-s'],
  category: 'Crypto',
});
