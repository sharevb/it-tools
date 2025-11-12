import { PictureInPicture } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-converter.title'),
  path: '/image-converter',
  description: t('tools.image-converter.description'),
  keywords: ['image', 'svg', 'bmp', 'gif', 'ico', 'jpg', 'png', 'tga', 'pvr', 'tiff', 'pnm', 'pbm', 'pgm', 'ppm', 'psd', 'webp', 'converter'],
  component: () => import('./image-converter.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2024-08-15'),
  category: 'Images',
});
