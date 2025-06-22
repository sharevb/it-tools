import { FileExport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pdf-extract.title'),
  path: '/pdf-extract',
  description: translate('tools.pdf-extract.description'),
  keywords: ['pdf', 'page', 'extract'],
  component: () => import('./pdf-extract.vue'),
  icon: FileExport,
  createdAt: new Date('2025-03-09'),
  category: 'PDF',
});
