import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pgp-file-encryption.title'),
  path: '/pgp-file-encryption',
  description: t('tools.pgp-file-encryption.description'),
  keywords: ['pgp', 'file', 'encryption'],
  component: () => import('./pgp-file-encryption.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/CloudLock')),
  createdAt: new Date('2026-03-07'),
  category: 'Crypto',
});
