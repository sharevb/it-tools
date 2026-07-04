import { Edit } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.unicode-formatter.title'),
  path: '/unicode-formatter',
  description: t('tools.unicode-formatter.description'),
  keywords: ['unicode', 'formatter', 'fonts'],
  component: () => import('./unicode-formatter.vue'),
  icon: Edit,
  createdAt: new Date('2024-04-07'),
  category: 'Text',
});
