import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pdf-text-extractor.title'),
  path: '/pdf-text-extractor',
  description: t('tools.pdf-text-extractor.description'),
  keywords: ['pdf', 'text', 'extractor'],
  component: () => import('./pdf-text-extractor.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileExport')),
  createdAt: new Date('2025-05-08'),
  category: 'PDF',
});
