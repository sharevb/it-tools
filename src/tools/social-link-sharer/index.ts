import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.social-link-sharer.title'),
  path: '/social-link-sharer',
  description: t('tools.social-link-sharer.description'),
  keywords: ['social', 'link', 'sharer'],
  component: () => import('./social-link-sharer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Share')),
  createdAt: new Date('2025-08-15'),
  category: 'Text',
});
