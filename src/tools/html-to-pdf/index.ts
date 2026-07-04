import { translate as t } from '@/plugins/i18n.plugin';
import { Printer } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-to-pdf.title'),
  path: '/html-to-pdf',
  description: t('tools.html-to-pdf.description'),
  keywords: ['html', 'url', 'pdf'],
  component: () => import('./html-to-pdf.vue'),
  icon: Printer,
  createdAt: new Date('2026-04-07'),
  category: 'PDF',
  externAccessDescription: t('tools.html-to-pdf.externalAccess'),
});
