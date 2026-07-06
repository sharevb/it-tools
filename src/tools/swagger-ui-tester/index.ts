import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.swagger-ui-tester.title'),
  path: '/swagger-ui-tester',
  description: t('tools.swagger-ui-tester.description'),
  keywords: ['swagger', 'manifest', 'tester'],
  component: () => import('./swagger-ui-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Mountain')),
  createdAt: new Date('2025-07-14'),
  category: 'Development',
});
