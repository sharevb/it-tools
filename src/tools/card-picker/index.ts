import { PlayCard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.card-picker.title'),
  path: '/card-picker',
  description: t('tools.card-picker.description'),
  keywords: ['card', 'deck', 'picker'],
  component: () => import('./card-picker.vue'),
  icon: PlayCard,
  createdAt: new Date('2025-02-09'),
  category: 'Gaming',
});
