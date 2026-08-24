import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.code-highlighter.title'),
  path: '/code-highlighter',
  description: t('tools.code-highlighter.description'),
  keywords: ['code', 'highlighter'],
  component: () => import('./code-highlighter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Code')),
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
