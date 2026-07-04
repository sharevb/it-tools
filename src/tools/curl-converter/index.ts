import { ExternalLink } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.curl-converter.title'),
  path: '/curl-converter',
  description: t('tools.curl-converter.description'),
  keywords: ['curl', 'code', 'language', 'generator'],
  component: () => import('./curl-converter.vue'),
  icon: ExternalLink,
  createdAt: new Date('2024-04-20'),
  category: 'Development',
});
