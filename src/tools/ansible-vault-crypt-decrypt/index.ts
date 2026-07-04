import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ansible-vault-crypt-decrypt.title'),
  path: '/ansible-vault-crypt-decrypt',
  description: t('tools.ansible-vault-crypt-decrypt.description'),
  keywords: ['ansible', 'vault', 'crypt', 'decrypt'],
  component: () => import('./ansible-vault-crypt-decrypt.vue'),
  icon: LockSquare,
  createdAt: new Date('2024-02-25'),
  category: 'Crypto',
});
