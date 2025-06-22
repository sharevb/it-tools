import { FileExport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pdf-text-extractor.title'),
  path: '/pdf-text-extractor',
  description: translate('tools.pdf-text-extractor.description'),
  keywords: ['pdf', 'text', 'extractor'],
  component: () => import('./pdf-text-extractor.vue'),
  icon: FileExport,
  createdAt: new Date('2025-05-08'),
  category: 'PDF',
});
