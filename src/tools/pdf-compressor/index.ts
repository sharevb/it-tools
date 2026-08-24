import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pdf-compressor.title'),
  path: '/pdf-compressor',
  description: t('tools.pdf-compressor.description'),
  keywords: ['pdf', 'optimize', 'compressor'],
  component: () => import('./pdf-compressor.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileZip')),
  createdAt: new Date('2025-11-11'),
  category: 'PDF',
});
