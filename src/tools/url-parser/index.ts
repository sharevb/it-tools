import { Unlink } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.url-parser.title'),
  path: '/url-parser',
  description: t('tools.url-parser.description'),
  keywords: ['url', 'parser', 'protocol', 'origin', 'params', 'port', 'username', 'password', 'href'],
  component: () => import('./url-parser.vue'),
  icon: Unlink,
  category: 'Forensic',
});
