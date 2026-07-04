import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.api-tester.title'),
  path: '/api-tester',
  description: t('tools.api-tester.description'),
  keywords: ['api', 'http', 'call', 'tester'],
  component: () => import('./api-tester.vue'),
  icon: World,
  createdAt: new Date('2024-05-11'),
  category: 'Development',
  externAccessDescription: t('tools.api-tester.externalAccess'),
});
