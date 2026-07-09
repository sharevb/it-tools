import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.argon2-hash.title'),
  path: '/argon2-hash',
  description: t('tools.argon2-hash.description'),
  keywords: ['argon2', 'argon2i', 'argon2d', 'argon2id', 'hash'],
  component: () => import('./argon2-hash.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/EyeOff')),
  createdAt: new Date('2025-12-07'),
  category: 'Crypto',
});
