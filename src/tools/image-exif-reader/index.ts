import { FileInfo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-exif-reader.title'),
  path: '/image-exif-reader',
  description: translate('tools.image-exif-reader.description'),
  keywords: ['image', 'exif', 'reader', 'iptc', 'gps', 'xmp', 'jpeg', 'quality'],
  component: () => import('./image-exif-reader.vue'),
  icon: FileInfo,
  createdAt: new Date('2024-01-09'),
  category: 'Images',
});
