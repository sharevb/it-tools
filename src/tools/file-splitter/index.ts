import { Cut } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.file-splitter.title'),
  path: '/file-splitter',
  description: t('tools.file-splitter.description'),
  keywords: ['file', 'json', 'xml', 'text', 'splitter'],
  component: () => import('./file-splitter.vue'),
  icon: Cut,
  createdAt: new Date('2025-11-11'),
  category: 'Development',
});
