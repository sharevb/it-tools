import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-image-downloader.title'),
  path: '/docker-image-downloader',
  description: t('tools.docker-image-downloader.description'),
  keywords: ['docker', 'image', 'downloader'],
  component: () => import('./docker-image-downloader.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileDownload')),
  createdAt: new Date('2026-01-18'),
  category: 'Docker',
  externAccessDescription: t('tools.docker-image-downloader.externalAccess'),
});
