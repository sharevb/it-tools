import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.xpath-tester.title'),
  path: '/xpath-tester',
  description: translate('tools.xpath-tester.description'),
  keywords: ['xpath', 'xml', 'tester'],
  component: () => import('./xpath-tester.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
  category: 'XML',
});
