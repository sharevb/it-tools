import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.potrace.title'),
  path: '/potrace',
  description: t('tools.potrace.description'),
  keywords: ['potrace', 'image', 'svg', 'raster', 'vectorial'],
  component: () => import('./potrace.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-05-11'),
  category: 'Images',
});
