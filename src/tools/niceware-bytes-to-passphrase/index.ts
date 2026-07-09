import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.niceware-bytes-to-passphrase.title'),
  path: '/niceware-bytes-to-passphrase',
  description: t('tools.niceware-bytes-to-passphrase.description'),
  keywords: ['niceware', 'bytes', 'passphrase'],
  component: () => import('./niceware-bytes-to-passphrase.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Binary')),
  createdAt: new Date('2025-10-05'),
  category: 'Crypto',
});
