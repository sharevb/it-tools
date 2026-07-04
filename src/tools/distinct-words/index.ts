import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.distinct-words.title'),
  path: '/distinct-words',
  description: t('tools.distinct-words.description'),
  keywords: ['distinct', 'words'],
  component: () => import('./distinct-words.vue'),
  icon: FileText,
  createdAt: new Date('2025-05-01'),
  category: 'Text',
});
