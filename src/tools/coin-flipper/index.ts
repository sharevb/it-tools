import { Coin } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.coin-flipper.title'),
  path: '/coin-flipper',
  description: translate('tools.coin-flipper.description'),
  keywords: ['coin', 'flipper'],
  component: () => import('./coin-flipper.vue'),
  icon: Coin,
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
