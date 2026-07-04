import { List } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.list-converter.title'),
  path: '/list-converter',
  description: t('tools.list-converter.description'),
  keywords: ['list', 'converter', 'sort', 'reverse', 'prefix', 'suffix', 'lowercase', 'truncate'],
  component: () => import('./list-converter.vue'),
  icon: List,
  createdAt: new Date('2023-05-07'),
  category: 'Text',
});
