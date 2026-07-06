import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.folder-structure-diagram.title'),
  path: '/folder-structure-diagram',
  description: t('tools.folder-structure-diagram.description'),
  keywords: ['folder', 'structure', 'diagram', 'tree', 'ascii'],
  component: () => import('./folder-structure-diagram.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconFolderSymlink.mjs')),
  createdAt: new Date('2024-04-20'),
  category: 'Text',
});
