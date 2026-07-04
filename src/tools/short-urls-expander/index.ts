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
  externAccessDescription: t('tools.short-urls-expander.externalAccess'),
});
