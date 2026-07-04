import { ArrowsShuffle } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.random-line-picker.title'),
  path: '/random-line-picker',
  description: t('tools.random-line-picker.description'),
  keywords: ['text', 'random', 'line', 'picker', 'shuffle'],
  component: () => import('./random-line-picker.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2026-05-08'),
  category: 'Text',
});
