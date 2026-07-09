import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.remove-exif.title'),
  path: '/remove-exif',
  description: t('tools.remove-exif.description'),
  keywords: ['remove', 'exif', 'jpeg'],
  component: () => import('./remove-exif.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/PictureInPictureOff')),
  createdAt: new Date('2024-07-14'),
  category: 'Images',
});
