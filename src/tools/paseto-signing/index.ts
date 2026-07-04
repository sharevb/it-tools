import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.paseto-signing.title'),
  path: '/paseto-signing',
  description: t('tools.paseto-signing.description'),
  keywords: ['paseto', 'signing', 'verify', 'paserk', 'payload'],
  component: () => import('./paseto-signing.vue'),
  icon: Key,
  createdAt: new Date('2025-04-21'),
  category: 'Crypto',
});
