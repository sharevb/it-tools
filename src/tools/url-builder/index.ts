import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.url-builder.title'),
  path: '/url-builder',
  description: t('tools.url-builder.description'),
  keywords: ['url', 'builder'],
  component: () => import('./url-builder.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/WorldUpload')),
  createdAt: new Date('2026-07-04'),
  category: 'Forensic',
});
