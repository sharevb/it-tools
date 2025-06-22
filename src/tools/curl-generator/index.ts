import { Download } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.curl-generator.title'),
  path: '/curl-generator',
  description: translate('tools.curl-generator.description'),
  keywords: ['curl'],
  component: () => import('./curl-generator.vue'),
  icon: Download,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
