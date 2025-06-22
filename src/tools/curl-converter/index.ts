import { ExternalLink } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.curl-converter.title'),
  path: '/curl-converter',
  description: translate('tools.curl-converter.description'),
  keywords: ['curl', 'code', 'language', 'generator'],
  component: () => import('./curl-converter.vue'),
  icon: ExternalLink,
  createdAt: new Date('2024-04-20'),
  category: 'Development',
});
