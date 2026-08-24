import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-resizer.title'),
  path: '/image-resizer',
  description: '',
  keywords: ['image', 'resizer', 'favicon', 'jpg', 'jpeg', 'png', 'webp'],
  component: () => import('./image-resizer.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconResize.mjs')),
  createdAt: new Date('2024-10-22'),
  category: 'Images',
});
