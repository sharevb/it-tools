import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.image-to-ascii-art.title'),
  path: '/image-to-ascii-art',
  description: translate('tools.image-to-ascii-art.description'),
  keywords: ['image', 'ascii', 'art'],
  component: () => import('./image-to-ascii-art.vue'),
  icon: Artboard,
  createdAt: new Date('2024-03-15'),
  category: 'Text',
});
