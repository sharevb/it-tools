import { LockSquare } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.bcrypt.title'),
  path: '/bcrypt',
  description: t('tools.bcrypt.description'),
  keywords: ['bcrypt', 'hash', 'compare', 'password', 'salt', 'round', 'storage', 'crypto'],
  component: () => import('./bcrypt.vue'),
  icon: LockSquare,
  npmPackages: ['bcryptjs'],
  category: 'Crypto',
});
