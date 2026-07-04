import { ArrowsShuffle } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
