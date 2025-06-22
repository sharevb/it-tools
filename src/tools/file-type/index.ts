import { File } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.file-type.title'),
  path: '/file-type',
  description: translate('tools.file-type.description'),
  keywords: ['file', 'type', 'identify', 'detector'],
  component: () => import('./file-type.vue'),
  icon: File,
  createdAt: new Date('2024-04-20'),
  category: 'Forensic',
});
