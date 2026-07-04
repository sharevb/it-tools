import { PictureInPicture } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.svg-previewer.title'),
  path: '/svg-previewer',
  description: t('tools.svg-previewer.description'),
  keywords: ['svg', 'previewer'],
  component: () => import('./svg-previewer.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2025-12-14'),
  category: 'Images',
});
