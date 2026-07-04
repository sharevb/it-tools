import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ansi-escape-tester.title'),
  path: '/ansi-escape-tester',
  description: t('tools.ansi-escape-tester.description'),
  keywords: ['ansi', 'escape', 'tester'],
  component: () => import('./ansi-escape-tester.vue'),
  icon: Terminal2,
  createdAt: new Date('2025-07-06'),
  category: 'Development',
});
