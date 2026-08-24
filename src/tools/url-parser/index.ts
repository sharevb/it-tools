import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.url-parser.title'),
  path: '/url-parser',
  description: t('tools.url-parser.description'),
  keywords: ['url', 'parser', 'protocol', 'origin', 'params', 'port', 'username', 'password', 'href'],
  component: () => import('./url-parser.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Unlink')),
  category: 'Forensic',
});
