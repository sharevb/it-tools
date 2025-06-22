import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.paseto-encryption.title'),
  path: '/paseto-encryption',
  description: translate('tools.paseto-encryption.description'),
  keywords: ['paseto', 'encryption', 'paserk', 'payload'],
  component: () => import('./paseto-encryption.vue'),
  icon: Key,
  createdAt: new Date('2025-04-21'),
  category: 'Crypto',
});
