import { IconFileDownload } from '@tabler/icons-vue';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.multi-link-downloader.title'),
  path: '/multi-link-downloader',
  description: t('tools.multi-link-downloader.description'),
  keywords: ['multi', 'link', 'downloader'],
  component: () => import('./multi-link-downloader.vue'),
  icon: IconFileDownload,
  createdAt: new Date('2024-10-18'),
  category: 'Network',
  externAccessDescription: t('tools.multi-link-downloader.externalAccess'),
});
