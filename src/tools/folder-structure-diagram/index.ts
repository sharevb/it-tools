import { translate as t } from '@/plugins/i18n.plugin';
import { IconFolderSymlink } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.folder-structure-diagram.title'),
  path: '/folder-structure-diagram',
  description: t('tools.folder-structure-diagram.description'),
  keywords: ['folder', 'structure', 'diagram', 'tree', 'ascii'],
  component: () => import('./folder-structure-diagram.vue'),
  icon: IconFolderSymlink,
  createdAt: new Date('2024-04-20'),
  category: 'Text',
});
