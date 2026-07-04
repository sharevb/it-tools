import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.unicode-search.title'),
  path: '/unicode-search',
  description: t('tools.unicode-search.description'),
  keywords: ['unicode', 'search'],
  component: () => import('./unicode-search.vue'),
  icon: FileText,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
