import { IconResize } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-resizer.title'),
  path: '/image-resizer',
  description: '',
  keywords: ['image', 'resizer', 'favicon', 'jpg', 'jpeg', 'png', 'webp'],
  component: () => import('./image-resizer.vue'),
  icon: IconResize,
  createdAt: new Date('2024-10-22'),
  category: 'Images',
});
