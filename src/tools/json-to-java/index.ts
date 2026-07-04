import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-java.title'),
  path: '/json-to-java',
  description: t('tools.json-to-java.description'),
  keywords: ['json', 'to', 'java'],
  component: () => import('./json-to-java.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-07-03'),
  category: 'JSON',
});
