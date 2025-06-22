import { IconFileDownload } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.multi-link-downloader.title'),
  path: '/multi-link-downloader',
  description: translate('tools.multi-link-downloader.description'),
  keywords: ['multi', 'link', 'downloader'],
  component: () => import('./multi-link-downloader.vue'),
  icon: IconFileDownload,
  createdAt: new Date('2024-10-18'),
  category: 'Network',
});
