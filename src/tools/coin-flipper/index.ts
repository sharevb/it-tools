import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.coin-flipper.title'),
  path: '/coin-flipper',
  description: t('tools.coin-flipper.description'),
  keywords: ['coin', 'flipper'],
  component: () => import('./coin-flipper.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Coin')),
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
