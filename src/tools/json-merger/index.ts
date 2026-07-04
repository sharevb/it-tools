import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-merger.title'),
  path: '/json-merger',
  description: t('tools.json-merger.description'),
  keywords: ['json', 'merger'],
  component: () => import('./json-merger.vue'),
  icon: Braces,
  createdAt: new Date('2025-07-19'),
  category: 'JSON',
});
