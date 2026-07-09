import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.fortune-wheel.title'),
  path: '/fortune-wheel',
  description: t('tools.fortune-wheel.description'),
  keywords: ['fortune', 'wheel'],
  component: () => import('./fortune-wheel.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconWheel.mjs')),
  createdAt: new Date('2025-02-24'),
  category: 'Gaming',
});
