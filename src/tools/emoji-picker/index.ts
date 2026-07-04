import { MoodSmile } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.emoji-picker.title'),
  path: '/emoji-picker',
  description: t('tools.emoji-picker.description'),
  keywords: ['emoji', 'picker', 'unicode', 'copy', 'paste'],
  component: () => import('./emoji-picker.vue'),
  icon: MoodSmile,
  createdAt: new Date('2023-08-07'),
  npmPackages: ['unicode-emoji-json', 'emojilib'],
  category: 'Text',
});
