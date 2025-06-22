import { PlayCard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.card-picker.title'),
  path: '/card-picker',
  description: translate('tools.card-picker.description'),
  keywords: ['card', 'deck', 'picker'],
  component: () => import('./card-picker.vue'),
  icon: PlayCard,
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
