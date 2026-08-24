import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.file-type.title'),
  path: '/file-type',
  description: t('tools.file-type.description'),
  keywords: ['file', 'type', 'identify', 'detector'],
  component: () => import('./file-type.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/File')),
  createdAt: new Date('2024-04-20'),
  category: 'Forensic',
});
