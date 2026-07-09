import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.stacktrace-prettier.title'),
  path: '/stacktrace-prettier',
  description: t('tools.stacktrace-prettier.description'),
  keywords: ['stacktrace', 'prettier', 'highlighter'],
  component: () => import('./stacktrace-prettier.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Stack')),
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
