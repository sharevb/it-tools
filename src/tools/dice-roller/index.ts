import { Dice } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dice-roller.title'),
  path: '/dice-roller',
  description: translate('tools.dice-roller.description'),
  keywords: ['dice', 'rng', 'rpg', 'roller'],
  component: () => import('./dice-roller.vue'),
  icon: Dice,
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
