import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.picomatch-tester.title'),
  path: '/picomatch-tester',
  description: t('tools.picomatch-tester.description'),
  keywords: ['picomatch', 'tester', 'glob', 'pattern', 'matching'],
  component: () => import('./picomatch-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileDiff')),
  createdAt: new Date('2026-07-05'),
  category: 'Development',
});
