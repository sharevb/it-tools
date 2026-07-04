import { translate as t } from '@/plugins/i18n.plugin';
import { CloudLock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pgp-file-encryption.title'),
  path: '/pgp-file-encryption',
  description: t('tools.pgp-file-encryption.description'),
  keywords: ['pgp', 'file', 'encryption'],
  component: () => import('./pgp-file-encryption.vue'),
  icon: CloudLock,
  createdAt: new Date('2026-03-07'),
  category: 'Crypto',
});
