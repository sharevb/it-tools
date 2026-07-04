import { BrandHtml5 } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-to-xhtml.title'),
  path: '/html-to-xhtml',
  description: t('tools.html-to-xhtml.description'),
  keywords: ['html', 'xhtml'],
  component: () => import('./html-to-xhtml.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2026-01-03'),
  category: 'Web',
});
