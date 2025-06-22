import { Folder } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.folder-structure-diagram.title'),
  path: '/folder-structure-diagram',
  description: translate('tools.folder-structure-diagram.description'),
  keywords: ['folder', 'structure', 'diagram', 'tree', 'ascii'],
  component: () => import('./folder-structure-diagram.vue'),
  icon: Folder,
  createdAt: new Date('2024-04-20'),
  category: 'Text',
});
