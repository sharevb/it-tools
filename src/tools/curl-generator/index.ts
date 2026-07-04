import { Download } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.curl-generator.title'),
  path: '/curl-generator',
  description: t('tools.curl-generator.description'),
  keywords: ['curl'],
  component: () => import('./curl-generator.vue'),
  icon: Download,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
