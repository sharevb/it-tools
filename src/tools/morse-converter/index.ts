import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.morse-converter.title'),
  path: '/morse-converter',
  description: t('tools.morse-converter.description'),
  keywords: ['morse', 'converter'],
  component: () => import('./morse-converter.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-04-20'),
  category: 'Text',
});
