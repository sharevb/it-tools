import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.html-to-xhtml.title'),
  path: '/html-to-xhtml',
  description: t('tools.html-to-xhtml.description'),
  keywords: ['html', 'xhtml'],
  component: () => import('./html-to-xhtml.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandHtml5')),
  createdAt: new Date('2026-01-03'),
  category: 'Web',
});
