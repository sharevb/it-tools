import { Mountain } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.swagger-ui-tester.title'),
  path: '/swagger-ui-tester',
  description: t('tools.swagger-ui-tester.description'),
  keywords: ['swagger', 'manifest', 'tester'],
  component: () => import('./swagger-ui-tester.vue'),
  icon: Mountain,
  createdAt: new Date('2025-07-14'),
  category: 'Development',
});
