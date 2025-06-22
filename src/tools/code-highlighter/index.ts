import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.code-highlighter.title'),
  path: '/code-highlighter',
  description: translate('tools.code-highlighter.description'),
  keywords: ['code', 'highlighter'],
  component: () => import('./code-highlighter.vue'),
  icon: Code,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
