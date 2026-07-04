import { Share } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.shamirs-secret-sharing.title'),
  path: '/shamirs-secret-sharing',
  description: t('tools.shamirs-secret-sharing.description'),
  keywords: ['shamirs', 'secret', 'sharing'],
  component: () => import('./shamirs-secret-sharing.vue'),
  icon: Share,
  createdAt: new Date('2025-11-29'),
  category: 'Crypto',
});
