import { Bookmarks } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.torrent-to-magnet.title'),
  path: '/torrent-to-magnet',
  description: t('tools.torrent-to-magnet.description'),
  keywords: ['torrent', 'magnet', 'url', 'link'],
  component: () => import('./torrent-to-magnet.vue'),
  icon: Bookmarks,
  createdAt: new Date('2024-04-20'),
  category: 'Converters',
});
