import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.fortune-wheel.title'),
  path: '/fortune-wheel',
  description: translate('tools.fortune-wheel.description'),
  keywords: ['fortune', 'wheel'],
  component: () => import('./fortune-wheel.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-02-24'),
  category: 'Gaming',
});
