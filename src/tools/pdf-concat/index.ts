import { FileImport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pdf-concat.title'),
  path: '/pdf-concat',
  description: t('tools.pdf-concat.description'),
  keywords: ['pdf', 'concat'],
  component: () => import('./pdf-concat.vue'),
  icon: FileImport,
  createdAt: new Date('2025-03-09'),
  category: 'PDF',
});
