import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.jq-tester.title'),
  path: '/jq-tester',
  description: translate('tools.jq-tester.description'),
  keywords: ['jq', 'json', 'tester', 'jsonpath'],
  component: () => import('./jq-tester.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
