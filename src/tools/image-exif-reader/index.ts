import { FileInfo } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.image-exif-reader.title'),
  path: '/image-exif-reader',
  description: t('tools.image-exif-reader.description'),
  keywords: ['image', 'exif', 'reader', 'iptc', 'gps', 'xmp', 'jpeg', 'quality'],
  component: () => import('./image-exif-reader.vue'),
  icon: FileInfo,
  createdAt: new Date('2024-01-09'),
  category: 'Images',
});
