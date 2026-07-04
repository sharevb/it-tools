import { HandMove } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.xslt-tester.title'),
  path: '/xslt-tester',
  description: t('tools.xslt-tester.description'),
  keywords: ['xslt', 'xml', 'tester'],
  component: () => import('./xslt-tester.vue'),
  icon: HandMove,
  createdAt: new Date('2024-05-11'),
  category: 'XML',
});
