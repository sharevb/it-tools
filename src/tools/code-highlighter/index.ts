import { Code } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.code-highlighter.title'),
  path: '/code-highlighter',
  description: t('tools.code-highlighter.description'),
  keywords: ['code', 'highlighter'],
  component: () => import('./code-highlighter.vue'),
  icon: Code,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
