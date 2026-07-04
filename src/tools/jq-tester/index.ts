import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.jq-tester.title'),
  path: '/jq-tester',
  description: t('tools.jq-tester.description'),
  keywords: ['jq', 'json', 'tester', 'jsonpath', 'query', 'path'],
  component: () => import('./jq-tester.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-15'),
  category: 'JSON',
});
