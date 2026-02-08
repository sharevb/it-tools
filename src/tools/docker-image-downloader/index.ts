import { FileDownload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Image Downloader',
  path: '/docker-image-downloader',
  description: 'Download a docker image given a docker registry, an architecture and an image name',
  keywords: ['docker', 'image', 'downloader'],
  component: () => import('./docker-image-downloader.vue'),
  icon: FileDownload,
  createdAt: new Date('2026-01-18'),
  category: 'Docker',
  externAccessDescription: 'This tool downloads Docker Images from registry (and with username, password or token you provide)',
});
