import { Coin } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.coin-flipper.title'),
  path: '/coin-flipper',
  description: t('tools.coin-flipper.description'),
  keywords: ['coin', 'flipper'],
  component: () => import('./coin-flipper.vue'),
  icon: Coin,
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
