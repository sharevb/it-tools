import { Stack } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.stacktrace-prettier.title'),
  path: '/stacktrace-prettier',
  description: translate('tools.stacktrace-prettier.description'),
  keywords: ['stacktrace', 'prettier', 'highlighter'],
  component: () => import('./stacktrace-prettier.vue'),
  icon: Stack,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
