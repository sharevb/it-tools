import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-query.title'),
  path: '/json-query',
  description: t('tools.json-query.description'),
  keywords: ['json', 'query', 'jsonquery', 'lang'],
  component: () => import('./json-query.vue'),
  icon: Braces,
  createdAt: new Date('2025-07-06'),
  category: 'JSON',
});
