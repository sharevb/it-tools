import { WorldDownload } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.short-urls-expander.title'),
  path: '/short-urls-expander',
  description: t('tools.short-urls-expander.description'),
  keywords: ['short', 'urls', 'expander'],
  component: () => import('./short-urls-expander.vue'),
  icon: WorldDownload,
  createdAt: new Date('2025-11-29'),
  category: 'Forensic',
  externAccessDescription: 'This tool use a CORS Anywhere instance (by default, https://cors.outils-libre.org) to send HEAD http request (no data downloaded) to get HTTP headers and redirects',
});
