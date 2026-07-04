import { Search } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.smart-text-replacer.title'),
  path: '/smart-text-replacer',
  description: t('tools.smart-text-replacer.description'),
  keywords: ['smart', 'text-replacer', 'linebreak', 'remove', 'add', 'split', 'search', 'replace'],
  component: () => import('./smart-text-replacer.vue'),
  icon: Search,
  createdAt: new Date('2024-04-03'),
  category: 'Text',
});
