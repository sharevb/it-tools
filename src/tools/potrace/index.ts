import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.potrace.title'),
  path: '/potrace',
  description: translate('tools.potrace.description'),
  keywords: ['potrace', 'image', 'svg', 'raster', 'vectorial'],
  component: () => import('./potrace.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-05-11'),
  category: 'Images',
});
